#! /bin/bash

files_changed=("index.html" "photography.html" "project.html" "src/css/photography.css" "src/css/project.css" "src/js/photography.js" 
"src/js/project.js" "photography-gallery.html" "src/js/index.obf.js" "src/js/photography.obf.js" "src/js/project.obf.js")

for file in "${files_changed[@]}"; do
    if [ -f "$file" ]; then
        echo "Uploading $file"
        aws s3 cp $file s3://$BUCKET_NAME/$file
        echo "Uploaded $file"
    fi
done

echo "Portfolio successfully updated"