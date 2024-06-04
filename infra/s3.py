import boto3

def upload_tfstate_to_s3(bucket_name, local_file_path, s3_file_name):
    # Create an S3 client
    s3 = boto3.client('s3')

    # Upload the file
    try:
        s3.upload_file(local_file_path, bucket_name, s3_file_name)
        print(f"File '{local_file_path}' uploaded successfully to S3 bucket '{bucket_name}' as '{s3_file_name}'.")
    except Exception as e:
        print(f"Error uploading file '{local_file_path}' to S3 bucket '{bucket_name}': {e}")

# Replace these values with your actual bucket name, local file path, and desired S3 file name
bucket_name = 'capstone-eks'
local_file_path = './terraform/terraform.tfstate'
s3_file_name = 'terraform.tfstate'

# Upload Terraform state file to S3 bucket
upload_tfstate_to_s3(bucket_name, local_file_path, s3_file_name)