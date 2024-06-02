#!/bin/bash

# Define the path to the quill-editor.component.d.ts file
QUILL_EDITOR_FILE="node_modules/ngx-quill/lib/quill-editor.component.d.ts"

# Define the new import lines
NEW_IMPORT_LINES="import QuillType from 'quill';\nimport Delta from 'quill';"

# Replace the import line in the file
sed -i "1s/.*/$NEW_IMPORT_LINES/" "$QUILL_EDITOR_FILE"

echo "Import lines replaced successfully."