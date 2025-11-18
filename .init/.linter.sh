#!/bin/bash
cd /home/kavia/workspace/code-generation/micro-skill-learning-platform-262945-262962/micro_skill_lms_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

