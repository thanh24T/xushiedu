from flask import Blueprint, request, jsonify
from db.models import db, DrawingSession
from datetime import datetime, timedelta
from sqlalchemy import func

progress_bp = Blueprint('progress', __name__)

@progress_bp.route('/progress', methods=['POST'])
def save_progress():
    data      = request.get_json()
    user_id   = data.get('user_id')
    label     = data.get('label')
    lesson_id = data.get('lesson_id')
    is_correct = data.get('is_correct', True)
    tries     = data.get('tries', 1)

    if not user_id or not label:
        return jsonify({'error': 'Thiếu thông tin'}), 400

    session = DrawingSession(
        user_id=user_id,
        label=label,
        lesson_id=lesson_id,
        is_correct=is_correct,
        tries=tries
    )
    db.session.add(session)
    db.session.commit()

    return jsonify({'message': 'Đã lưu tiến độ', 'id': session.id}), 201


@progress_bp.route('/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    sessions = DrawingSession.query.filter_by(user_id=user_id).all()

    # Vocabulary size: số label unique đã vẽ đúng
    correct_labels = set(
        s.label for s in sessions if s.is_correct
    )
    vocab_size = len(correct_labels)

    # Motor skills: tỉ lệ đúng ngay lần đầu (tries == 1)
    correct_first = sum(1 for s in sessions if s.is_correct and s.tries == 1)
    total = len(sessions)
    motor_score = round((correct_first / total * 100) if total > 0 else 0)

    # Cognitive engagement: tỉ lệ hoàn thành
    engagement = round((len([s for s in sessions if s.is_correct]) / total * 100) if total > 0 else 0)

    # Chart data: từ tháng đầu tiên có session đến hiện tại, tối đa 6 tháng
    chart = []
    now = datetime.utcnow()

    if sessions:
        first_date = min(s.completed_at for s in sessions)
        start = first_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # Lùi về 1 tháng trước để có đường
        if start.month == 1:
            start = start.replace(year=start.year-1, month=12)
        else:
            start = start.replace(month=start.month-1)
    else:
        start = now.replace(day=1)

    # Tạo list các tháng từ start đến now, tối đa 6
    months = []
    cur = start
    while cur <= now and len(months) < 6:
        months.append(cur)
        # Sang tháng tiếp theo
        if cur.month == 12:
            cur = cur.replace(year=cur.year+1, month=1)
        else:
            cur = cur.replace(month=cur.month+1)

    cumulative = set()
    for month_start in months:
        if month_start.month == 12:
            month_end = month_start.replace(year=month_start.year+1, month=1)
        else:
            month_end = month_start.replace(month=month_start.month+1)

        month_sessions = [
            s for s in sessions
            if s.is_correct and month_start <= s.completed_at < month_end
        ]
        for s in month_sessions:
            cumulative.add(s.label)
        chart.append({
            'month': f'T{month_start.month}',
            'value': len(cumulative)
        })

    # Recent activities
    recent = sorted(sessions, key=lambda s: s.completed_at, reverse=True)[:5]

    # ── Stars ──────────────────────────────────────────────
    stars = 0
    for s in sessions:
        if s.is_correct:
            stars += 10
            if s.tries == 1:
                stars += 5  # bonus vẽ đúng ngay lần đầu

    # ── Streak ─────────────────────────────────────────────
    # Lấy tập hợp các ngày có session (theo local date)
    active_dates = set(s.completed_at.date() for s in sessions)
    streak = 0
    check = datetime.utcnow().date()
    # Nếu hôm nay chưa vẽ thì bắt đầu từ hôm qua
    if check not in active_dates:
        check -= timedelta(days=1)
    while check in active_dates:
        streak += 1
        check -= timedelta(days=1)

    # ── Badges ─────────────────────────────────────────────
    ANIMAL_LABELS = {'cat', 'zebra', 'mouse'}
    correct_set = set(s.label for s in sessions if s.is_correct)
    correct_count = len([s for s in sessions if s.is_correct])
    animal_correct = correct_set & ANIMAL_LABELS

    badges = [
        {
            'id': 'artist',
            'name': 'Họa sĩ nhí',
            'unlocked': vocab_size >= 1,
            'locked_desc': 'Vẽ 1 hình đầu tiên'
        },
        {
            'id': 'animal_expert',
            'name': 'Chuyên gia Động vật',
            'unlocked': len(animal_correct) >= 3,
            'locked_desc': f'Vẽ đúng {3 - len(animal_correct)} động vật nữa'
        },
        {
            'id': 'math',
            'name': 'Nhà Toán Học',
            'unlocked': correct_count >= 10,
            'locked_desc': f'Cần thêm {max(0, 10 - correct_count)} bài'
        },
        {
            'id': 'astronaut',
            'name': 'Phi hành gia',
            'unlocked': motor_score >= 80,
            'locked_desc': f'Đạt motor score 80 (hiện tại: {motor_score})'
        },
    ]

    return jsonify({
        'vocab_size': vocab_size,
        'motor_score': motor_score,
        'engagement': engagement,
        'stars': stars,
        'streak': streak,
        'badges': badges,
        'chart': chart,
        'recent': [s.to_dict() for s in recent]
    })
