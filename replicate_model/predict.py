from cog import BasePredictor, Input
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import PeftModel

class Predictor(BasePredictor):
    def setup(self):
        """Hàm load model vào bộ nhớ"""
        print("Đang tải Base Model Llama-3-8B...", flush=True)
        base_model_name = "models/base"
        quantization_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
        )

        self.tokenizer = AutoTokenizer.from_pretrained(base_model_name)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        base_model = AutoModelForCausalLM.from_pretrained(
            base_model_name,
            quantization_config=quantization_config,
            device_map="auto"
        )

        print("Đang tải LoRA Model...", flush=True)
        lora_repo = "models/lora"
        self.model = PeftModel.from_pretrained(base_model, lora_repo)
        self.model.eval()
        print("Model đã sẵn sàng!", flush=True)

    def predict(
        self,
        label: str = Input(description="Tên loài vật hoặc sự vật cần mô tả (ví dụ: Con báo)", default="Con chó"),
    ) -> str:
        """Hàm chạy mỗi khi có request gửi tới Replicate"""
        prompt = f"Bạn là một chuyên gia về các loài vật và sự vật. Hãy cung cấp một đoạn mô tả ngắn gọn, thú vị về: {label}."
        
        messages = [
            {"role": "system", "content": "Bạn là một trợ lý thông minh hỗ trợ giải đáp thông tin một cách ngắn gọn, súc tích."},
            {"role": "user", "content": prompt}
        ]
        
        input_ids = self.tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt").to(self.model.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                input_ids,
                max_new_tokens=256,
                temperature=0.7,
                top_p=0.9,
                repetition_penalty=1.1,
                do_sample=True,
                eos_token_id=self.tokenizer.eos_token_id
            )
        
        generated_ids = outputs[0][len(input_ids[0]):]
        result = self.tokenizer.decode(generated_ids, skip_special_tokens=True).strip()
        return result
