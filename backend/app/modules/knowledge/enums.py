from enum import Enum

class FactCategory(str, Enum):
    COMMUNICATION = "COMMUNICATION"
    CLINICAL = "CLINICAL"
    COMMERCIAL = "COMMERCIAL"
    BEHAVIOR = "BEHAVIOR"
    RELATIONSHIP = "RELATIONSHIP"
    PREFERENCE = "PREFERENCE"

class FactStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"
    CONFLICTED = "CONFLICTED"

class FactSource(str, Enum):
    INTERACTION = "INTERACTION"
    SYSTEM = "SYSTEM"
    USER = "USER"
