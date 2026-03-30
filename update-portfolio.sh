#! /bin/bash

files_changed=("index.html")

for file in "${files_changed[@]}"; do
    if [ -f "$file" ]; then
        echo "Uploading $file"
        aws s3 cp $file s3://$BUCKET_NAME/$file
        echo "Uploaded $file"
    fi
done

echo "Portfolio successfully updated"