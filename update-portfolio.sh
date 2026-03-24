#! /bin/bash

files_changed=("index.html" "photography.html" "project.html" "src/css/index.css" "src/css/project.css" "src/css/photography.css" "src/images/me.jpg" "src/js/index.js" 
"src/js/photography.js" "src/js/project.js")

for file in "${files_changed[@]}"; do
    if [ -f "$file" ]; then
        echo "Uploading $file"
        aws s3 cp $file s3://${{ secrets.BUCKET_NAME }}/$file
        echo "Uploaded $file"
    fi
done

echo "Portfolio successfully updated"