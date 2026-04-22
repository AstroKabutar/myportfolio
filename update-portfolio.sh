#! /bin/bash

files_changed=( "project.html" "src/css/project.css" )

for file in "${files_changed[@]}"; do
    if [ -f "$file" ]; then
        echo "Uploading $file"
        aws s3 cp $file s3://$BUCKET_NAME/$file
        echo "Uploaded $file"
    fi
done

echo "Portfolio successfully updated"