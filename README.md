# Project overview
Rise hire is application used to help unemployed people to find jobs quickly everywhere in the world.

# Instruction on how to run RISE HIRE application:
-GO on index.html file 
-Right click anywher on the file
-Search for open live stream
-you will be directed to the website

# Credits to the API i used
I used Jsearch API for my website.
link: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/playground/endpoint_73845d59-2a15-4a88-92c5-e9b1bc90956d 

# Deployment
 step 1

- Connecting to servers web-01 & web-02
- Updating and installing apache2
   sudo apt update
   sudo apt install apache2
- Cloning my github repository to the server
- Starting and enabling apache
   sudo systemctl start apache2
   sudo systemctl enable apache2
   sudo systemctl status apache2
- Removing default apache page
   sudo rm -f /var/www/html/index.html
- Copying application files
   sudo cp /job-search-app/index.html /var/www/html/
   sudo cp /job-search-app/style.css /var/www/html/
   sudo cp /job-search-app/app.js /var/www/html/
- Setting proper permissions
   sudo chown -R www-data:www-data /var/www/html/
   sudo chmod -R 755 /var/www/html/
- Checking if files are in place
    ls -la /var/www/html/
- After i tested the websites both on web-01 and web-02

Step 2
Installing haproxy
- Connecting to my loadbalancer in ubuntu
- Installing haproxy
   sudo apt install haproxy -y
- Backing up original configurations
   sudo cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.backup
- Configuring haproxy
- Validating and restarting haproxy
   sudo haproxy -c -f /etc/haproxy/haproxy.cfg
   output: configuration file is valid
- Restarting haproxy
   sudo systemctl restart haproxy
   sudo systemctl enable haproxy
- Verifying the status
   sudo systemctl status haproxy
- Testing the load balancer 
  curl -I http://13.221.221.20

# Challenges i faced
- I made some changes in my files after i deployed and couldn't see the changes that i made on my website even thought i had pulled but i didn' see the changes.

i learned through my friend that my wbservers are not using my github folder. 

- my web servwers were serving /var/www/html and that folder still contained my old files. 
   sudo rm -rf /var/www/html

- I had to delete the old website folder and then move my github project into the correct place.
   sudo cp -r ~/job_search_app /var/www/html

- Restarted th apache everything was working
   sudo systemctl restart apache2

# Demo video
youtube link: https://youtu.be/zRyqxAq1-6c


















