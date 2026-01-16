#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test visual metadata extraction"""

import os
from openai import OpenAI
from dotenv import load_dotenv
from docx import Document

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Read essay
doc = Document('Course_Collective/birth of martin luther king jr-01-15-2026/output/essay_short.docx')
article_text = '\n'.join([para.text for para in doc.paragraphs if para.text.strip()])
topic = "Birth of Martin Luther King Jr"

print("="*60)
print("TESTING VISUAL METADATA EXTRACTION")
print("="*60)
print(f"\nTopic: {topic}")
print(f"Essay length: {len(article_text)} characters\n")

metadata_prompt = f"""Analyze this essay about "{topic}" and extract key visual information for AI image generation.

Essay:
{article_text[:2000]}

Extract and provide DETAILED information about:

1. GEOGRAPHIC LOCATION & REGION:
   - Specific city/country/continent
   - Regional landscape (mountains, deserts, coastal, urban, rural)
   - Climate and weather patterns typical to region
   - Notable landmarks or geographic features
   - Architecture style common to that region/era

2. TIME PERIOD & HISTORICAL CONTEXT:
   - Exact years or era
   - Historical period visual characteristics
   - Technology level of the time

3. PEOPLE & CULTURAL CONTEXT:
   - Who are the main people?
   - Physical descriptions (race/ethnicity, age range)
   - Traditional clothing styles of that region/time
   - Cultural elements specific to that location

4. VISUAL STYLE & AESTHETICS:
   - Art style (realistic, historical photograph style, illustrated, etc.)
   - Color palette (warm/cool tones, specific colors for region)
   - Lighting style (bright, muted, golden hour, etc.)

5. REGIONAL BACKGROUND ELEMENTS:
   - What backgrounds/settings fit this location?
   - Natural environment features
   - Architectural elements
   - Cultural symbols or objects

6. ATMOSPHERE & MOOD:
   - Emotional tone (hopeful, serious, celebratory, dramatic, etc.)
   - Energy level (calm, dynamic, intense)

Return as 2-4 concise sentences focusing heavily on LOCATION and REGIONAL characteristics for backgrounds.
Format as:
"Setting: [specific city/region, country]. Time: [era/years]. Background: [describe regional landscape, architecture, and environmental features]. Visual style: [art style, color palette, lighting]. People: [brief physical/cultural description]. Atmosphere: [mood]."
"""

print("[AI] Extracting visual metadata...")
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are an expert at extracting visual details for AI image generation. Be specific and concise."},
        {"role": "user", "content": metadata_prompt}
    ],
    temperature=0.3,
    max_tokens=500
)

metadata = response.choices[0].message.content.strip()

print("\n" + "="*60)
print("EXTRACTED VISUAL METADATA")
print("="*60)
print(metadata)
print("\n" + "="*60)
print(f"Length: {len(metadata)} characters")
print("="*60)
