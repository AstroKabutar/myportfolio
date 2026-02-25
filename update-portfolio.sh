#! /bin/bash

upload=""


if [ "$upload" == "index" ]; then
    echo "Uploading index.html"
    aws s3 cp index.html s3://${{ secrets.BUCKET_NAME }}/index.html
    echo "Uploaded"
fi

if [ "$upload" == "error" ]; then
    echo "Uploading error.html"
    aws s3 cp error.html s3://${{ secrets.BUCKET_NAME }}/error.html
    echo "Uploaded"
fi

if [ "$upload" == "image" ]; then
    echo "Uploading me.jpg"
    aws s3 cp me.jpg s3://${{ secrets.BUCKET_NAME }}/error.html
    echo "Uploaded"
fi

if [ "$upload" == "" ]; then
    echo "No files to upload"
fi