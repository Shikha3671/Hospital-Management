# Smart Hospital Management System on AWS

This beginner-friendly guide explains how to deploy the Smart Hospital Management System on AWS using EC2, RDS, S3, EFS, ALB, Auto Scaling, CloudWatch, SNS, IAM, VPC, and Security Groups.

---

## 1. Project Overview

The project is a hospital management system with:
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express.js
- Database: MySQL
- Version Control: Git + GitHub

The goal is to host the application on AWS so it can be accessed online, scaled, and monitored.

---

## 2. AWS Architecture (ASCII Diagram)

```text
Internet
   |
   v
[ Application Load Balancer ]
   |
   +--> [ EC2 Instance 1 ] --> [ RDS MySQL ]
   |
   +--> [ EC2 Instance 2 ] --> [ RDS MySQL ]
   |
   +--> [ EFS Shared Storage ]
   |
   +--> [ S3 Bucket for Static Files / Uploads ]
```

Notes:
- EC2 instances run the Node.js backend.
- RDS stores the MySQL database.
- EFS stores shared files.
- S3 stores uploaded files or frontend assets.
- Auto Scaling keeps the app available during traffic growth.

---

## 3. AWS Services Used

- EC2: Host the backend application
- EBS: Extra storage for the instance
- EFS: Shared storage for files
- RDS: Managed MySQL database
- S3: Store static files or uploads
- Application Load Balancer: Distribute traffic
- Auto Scaling: Add/remove EC2 instances automatically
- CloudWatch: Monitor CPU, memory, and logs
- SNS: Send email alerts
- IAM: Manage permissions securely
- VPC: Isolate the cloud network
- Security Groups: Control inbound/outbound traffic

---

## 4. Prerequisites

Before starting, make sure you have:
- An AWS account
- A domain name (optional)
- A GitHub account
- A local machine with Git, Node.js, and npm installed
- An SSH key pair (.pem file)

---

## 5. Local Setup

Go to the project folder:

```bash
cd "c:/Users/shalini/OneDrive/Desktop/hospital management"
```

Check the project files:

```bash
ls
```

Install dependencies for backend:

```bash
cd backend
npm install
```

Run the backend locally:

```bash
npm run dev
```

Open the frontend files in the browser from the frontend folder.

---

## 6. Push Code to GitHub

Initialize Git:

```bash
git init
git add .
git commit -m "Initial deployment setup"
```

Create a GitHub repository and connect it:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/smart-hospital-management.git
git push -u origin main
```

---

## 7. Launch EC2

In the AWS Console:
1. Open EC2 Dashboard
2. Click Launch Instance
3. Choose Ubuntu Server 22.04 LTS
4. Select an instance type such as t2.medium or t3.medium
5. Create or select a key pair
6. Configure storage: at least 20 GiB
7. Add a Security Group
8. Launch the instance

Use a public IP or Elastic IP for easier access.

---

## 8. Connect via SSH

If you are using Ubuntu:

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

If you are using Amazon Linux:

```bash
ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>
```

---

## 9. Install Git, Node.js & npm

Update the system and install required packages:

```bash
sudo apt update -y
sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Install PM2 for process management:

```bash
sudo npm install -g pm2
```

---

## 10. Clone Repository

```bash
cd ~
git clone https://github.com/<your-username>/smart-hospital-management.git
cd smart-hospital-management
```

---

## 11. Install Dependencies (npm install)

```bash
cd backend
npm install
```

If the root project uses a start script, you can also run:

```bash
cd ..
npm install
```

---

## 12. Configure .env

Create a .env file inside the backend folder:

```bash
cd ~/smart-hospital-management/backend
nano .env
```

Sample .env:

```env
PORT=5001
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=YourStrongPassword
DB_NAME=smart_hospital
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

Save and exit.

---

## 13. Create RDS & Import Database

In the AWS Console:
1. Open RDS Dashboard
2. Create database
3. Choose MySQL
4. Set username and password
5. Choose a small instance for learning purposes
6. Create the database

After creation, note the endpoint.

Import the SQL file:

```bash
mysql -h <RDS_ENDPOINT> -u admin -p < ~/smart-hospital-management/smart_hospital_mysql.sql
```

Enter the password when prompted.

---

## 14. Configure Security Groups

Create or edit a Security Group for the EC2 instance.

Allow:
- SSH: port 22 from your IP
- HTTP: port 80 from 0.0.0.0/0
- HTTPS: port 443 from 0.0.0.0/0
- Backend: port 5001 from the Load Balancer or your IP

For RDS, allow MySQL port 3306 from the EC2 Security Group.

---

## 15. Create S3 Bucket

Option 1: AWS Console
1. Open S3
2. Create bucket
3. Give it a unique name
4. Keep default settings for the college project

Optional CLI:

```bash
aws s3 mb s3://smart-hospital-uploads --region us-east-1
```

Upload your frontend static files or future images here if needed.

---

## 16. Configure EFS

In the AWS Console:
1. Open EFS
2. Create file system
3. Choose the same VPC as EC2
4. Create mount targets in the subnets

Install NFS client on EC2:

```bash
sudo apt install -y nfs-common
```

Mount EFS:

```bash
sudo mkdir -p /mnt/efs
sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2 <EFS_DNS>:/ /mnt/efs
```

Make it persistent:

```bash
echo '<EFS_DNS>:/ /mnt/efs nfs4 defaults,_netdev 0 0' | sudo tee -a /etc/fstab
```

---

## 17. Attach EBS Volume

In the AWS Console:
1. Create an EBS volume (for example 20 GiB)
2. Attach it to the EC2 instance
3. Connect to EC2 and format it

Commands:

```bash
lsblk
sudo mkfs -t ext4 /dev/xvdf
sudo mkdir -p /data
sudo mount /dev/xvdf /data
```

Make it permanent:

```bash
sudo blkid
```

Add the UUID to /etc/fstab.

---

## 18. Run Backend using PM2

Go to the backend folder:

```bash
cd ~/smart-hospital-management/backend
npm install
pm2 start src/app.js --name hospital-backend
pm2 save
pm2 status
```

Your backend should now run on port 5000.

---

## 19. Configure Nginx Reverse Proxy

Install Nginx:

```bash
sudo apt install -y nginx
```

Create a config file:

```bash
sudo nano /etc/nginx/sites-available/default
```

Example config:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## 20. Create AMI

After the instance is working:
1. Select the EC2 instance
2. Click Actions > Image and templates > Create image
3. Name it something like smart-hospital-ami
4. Create the image

This AMI will be used for Auto Scaling.

---

## 21. Create Launch Template

In EC2:
1. Go to Launch Templates
2. Click Create launch template
3. Use the AMI created earlier
4. Choose the instance type
5. Attach the correct Security Group and key pair
6. Save the template

---

## 22. Configure Auto Scaling Group

In EC2:
1. Go to Auto Scaling Groups
2. Create Auto Scaling Group
3. Choose the launch template
4. Select subnets
5. Set Min size = 1, Desired = 2, Max size = 2 or 3
6. Attach the Application Load Balancer
7. Create the group

This helps the app stay available during traffic changes.

---

## 23. Create Application Load Balancer & Target Group

In EC2:
1. Open Load Balancers
2. Create Application Load Balancer
3. Choose Internet-facing
4. Select the VPC and subnets
5. Create a target group for port 80
6. Register the EC2 instances
7. Attach the target group to the ALB

---

## 24. Configure Health Checks

In the Target Group:
- Set health check path to /
- Use HTTP port 80
- Expect a healthy response from the backend

If the app fails health checks, check:
- Nginx status
- PM2 process status
- Security group rules
- Port 5000 and 80 accessibility

---

## 25. Configure CloudWatch

Enable CloudWatch monitoring for EC2.

Create alarms for:
- CPU utilization above 80%
- Status check failures
- High memory usage

In AWS Console:
1. Open CloudWatch
2. Go to Alarms > Create alarm
3. Choose the EC2 metric
4. Set thresholds and notification actions

---

## 26. Configure SNS Email Alerts

In SNS:
1. Create a topic
2. Add an email subscription
3. Confirm the email link sent by AWS

In CloudWatch alarms, add the SNS topic as the notification destination.

---

## 27. IAM Roles & Permissions

Create an IAM role for EC2 with minimum necessary permissions such as:
- AmazonS3FullAccess or a more limited S3 policy
- CloudWatchAgentServerPolicy
- AmazonEC2ReadOnlyAccess

Attach this role to the EC2 instance.

Avoid using root user for daily work.

---

## 28. Testing Checklist

Test these after deployment:
- Website loads in the browser
- Login and registration work
- Doctor, patient, and appointment pages open correctly
- Backend API responds at /api
- Database records are saved and retrieved
- Load balancer sends traffic to healthy instances
- CloudWatch alarms are active
- SNS email notifications work

---

## 29. Troubleshooting

Common issues:
- Port 80/5000 is not open: check Security Groups
- Database connection fails: verify RDS endpoint, username, password, and Security Group
- PM2 process is not running: run `pm2 logs`
- Nginx not proxying: check `/etc/nginx/sites-available/default`
- Health checks fail: verify the app responds at `/`
- SSH denied: verify the key pair and Security Group rules

---

## 30. Security Best Practices

- Use strong passwords
- Keep private keys safe
- Use IAM roles instead of long-term access keys when possible
- Restrict Security Group access to only necessary ports
- Enable HTTPS using a certificate (optional for college project)
- Do not expose the database publicly unless required

---

## 31. Cost Optimization

- Use small instance sizes for learning projects
- Stop the instance when not in use
- Use EBS gp3 for cost-effective storage
- Delete unused volumes and snapshots
- Use Auto Scaling only when needed
- Turn off unused resources after testing

---

## 32. Future Scope

Possible improvements:
- Add CI/CD using GitHub Actions
- Add HTTPS with AWS Certificate Manager
- Use CloudFront for faster content delivery
- Add Docker container deployment
- Add monitoring dashboards for admins
- Improve security with WAF and backup strategies

---

## 33. Conclusion

This deployment shows how to host a college project on AWS using cloud-native services. It helps you understand real-world architecture, scalability, monitoring, and security for modern web applications.
