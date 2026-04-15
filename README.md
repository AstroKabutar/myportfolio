# This is my simple Portfolio Website
Here is a link to my medium article on how I made it.
https://medium.com/@shahin.sheikh1337/how-i-hosted-my-portfolio-website-2b1b6c09ba3f

main.tf file has the infrastructure configuration I used in this one.
Cloudfront distribution I created by hand beforetime for learning purposes so I repurposed it to use that.

Below is the tf code for the the IAM group and IAM user. I keep user and group codes in private repo so here is the snippet.

# IAM Group
```tf
resource "aws_iam_group" "main" {
  name = var.group_name
  path = var.group_path

}

resource "aws_iam_policy" "deny_bucket_access" {
  name        = "${var.group_name}-deny-bucket-access"
  path        = "/"
  description = "Denies all S3 access to the specified bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DenyBucketAccess"
        Effect = "Deny"
        Action = [
          "s3:*"
        ]
        Resource = [
          var.denied_bucket_arn,
          "${var.denied_bucket_arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_group_policy_attachment" "deny_bucket_access" {
  group      = aws_iam_group.main.name
  policy_arn = aws_iam_policy.deny_bucket_access.arn
}
```

# IAM User
```tf
resource "aws_iam_user" "portfoliowebsite_user" {
  name = var.uanme_portfoliowebsite
  path = var.user_path_portfoliowebsite

  tags = {
    Purpose = "CI/CD"
    Project = "portfoliowebsite"
  }
}

resource "aws_iam_user_group_membership" "portfoliowebsite_user_group_membership" {
  user   = aws_iam_user.portfoliowebsite_user.name
  groups = [var.group_name]
}

resource "aws_iam_user_policy" "portfoliowebsite_s3_put_object" {
  name = "s3-putobject-myportfoliowebsite"
  user = aws_iam_user.portfoliowebsite_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "VisualEditor0"
        Effect   = "Allow"
        Action   = "s3:PutObject"
        Resource = "arn:aws:s3:::xxxxxx-myportfoliowebsite/*"
      }
    ]
  })
}

resource "aws_iam_access_key" "portfoliowebsite_access_key" {
  user = aws_iam_user.portfoliowebsite_user.name
}

output "access_key_id_portfoliowebsite" {
  value     = aws_iam_access_key.portfoliowebsite_access_key.id
  sensitive = true
}

output "secret_access_key_portfoliowebsite" {
  value     = aws_iam_access_key.portfoliowebsite_access_key.secret
  sensitive = true
}

output "portfoliowebsite_user_name" {
  value = aws_iam_user.portfoliowebsite_user.name
}
```