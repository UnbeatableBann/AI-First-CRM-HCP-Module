from pydantic import SecretStr
from enum import Enum
from langchain_groq import ChatGroq
from app.config.settings import settings
from typing import Optional


class ModelType(str, Enum):
    GEMMA2 = "gemma2-9b-it"
    LLAMA3 = "llama-3.3-70b-versatile"


class LLMFactory:
    @staticmethod
    def get_llm(model: Optional[ModelType] = None, temperature: float = 0.0) -> ChatGroq:
        """
        Unified LLM Factory replacing direct ChatGroq instantiations.
        If `model` is not provided, defaults to LLM_MODEL from settings.
        """
        model_name = model.value if model else settings.LLM_MODEL

        # We can expand this to branch to ChatOpenAI or ChatGoogleGenAI based on the model chosen
        return ChatGroq(
            temperature=temperature,
            model=model_name,
            api_key=SecretStr(settings.GROQ_API_KEY),
        )
