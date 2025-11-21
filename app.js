// API Configuration
const API_KEY = '3ace9971d3mshbfcd96d4acb2218p19c05cjsnb1e499225079'; 
const API_HOST = 'jsearch.p.rapidapi.com';

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const jobQueryInput = document.getElementById('jobQuery');
const locationInput = document.getElementById('location');
const jobTypeSelect = document.getElementById('jobType');
const datePostedSelect = document.getElementById('datePosted');
const sortBySelect = document.getElementById('sortBy');
const jobListings = document.getElementById('jobListings');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const resultsCount = document.getElementById('resultsCount');

// Store fetched jobs
let allJobs = [];

// Event Listeners
searchBtn.addEventListener('click', searchJobs);
jobTypeSelect.addEventListener('change', filterAndDisplayJobs);
datePostedSelect.addEventListener('change', filterAndDisplayJobs);
sortBySelect.addEventListener('change', filterAndDisplayJobs);

// Allow Enter key to trigger search
jobQueryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchJobs();
});
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchJobs();
});

// Main search function
async function searchJobs() {
    const query = jobQueryInput.value.trim();
    const location = locationInput.value.trim();

    if (!query) {
        showError('Please enter a job title or keyword');
        return;
    }

    showLoading();
    hideError();

    try {
        const searchQuery = location ? `${query} in ${location}` : query;
        const url = `https://${API_HOST}/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            showError('No jobs found. Try different keywords or location.');
            allJobs = [];
            hideLoading();
            return;
        }

        allJobs = data.data;
        filterAndDisplayJobs();
        
    } catch (error) {
        console.error('Error fetching jobs:', error);
        showError('Failed to fetch jobs. Please check your API key and try again.');
        hideLoading();
    }
}

// Filter and display jobs based on selected filters
function filterAndDisplayJobs() {
    let filteredJobs = [...allJobs];

    // Filter by job type
    const jobType = jobTypeSelect.value;
    if (jobType) {
        filteredJobs = filteredJobs.filter(job => 
            job.job_employment_type === jobType
        );
    }

    // Filter by date posted
    const datePosted = datePostedSelect.value;
    if (datePosted !== 'all') {
        filteredJobs = filteredJobs.filter(job => {
            const jobDate = new Date(job.job_posted_at_datetime_utc);
            const now = new Date();
            const diffTime = Math.abs(now - jobDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            switch(datePosted) {
                case 'today': return diffDays <= 1;
                case '3days': return diffDays <= 3;
                case 'week': return diffDays <= 7;
                case 'month': return diffDays <= 30;
                default: return true;
            }
        });
    }

    // Sort jobs
    const sortBy = sortBySelect.value;
    if (sortBy === 'date') {
        filteredJobs.sort((a, b) => 
            new Date(b.job_posted_at_datetime_utc) - new Date(a.job_posted_at_datetime_utc)
        );
    }

    displayJobs(filteredJobs);
    hideLoading();
}

// Display jobs on the page
function displayJobs(jobs) {
    jobListings.innerHTML = '';

    if (jobs.length === 0) {
        showError('No jobs match your filters. Try adjusting them.');
        resultsCount.style.display = 'none';
        return;
    }

    resultsCount.textContent = `Found ${jobs.length} job${jobs.length > 1 ? 's' : ''}`;
    resultsCount.style.display = 'block';

    jobs.forEach(job => {
        const jobCard = createJobCard(job);
        jobListings.appendChild(jobCard);
    });
}

// Create individual job card
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';

    const description = job.job_description 
        ? job.job_description.substring(0, 250) + '...' 
        : 'No description available';

    const postedDate = formatDate(job.job_posted_at_datetime_utc);
    
    card.innerHTML = `
        <div class="job-header">
            <div>
                <h2 class="job-title">${job.job_title || 'No title'}</h2>
                <div class="company-name">${job.employer_name || 'Company not listed'}</div>
            </div>
            ${job.employer_logo ? `<img src="${job.employer_logo}" alt="${job.employer_name}" class="job-logo">` : ''}
        </div>

        <div class="job-details">
            <div class="detail-item"> ${job.job_city || job.job_state || job.job_country || 'Location not specified'}</div>
            ${job.job_employment_type ? `<span class="job-type">${formatJobType(job.job_employment_type)}</span>` : ''}
        </div>

        <div class="job-description">
            ${description}
        </div>

        <div class="job-footer">
            <a href="${job.job_apply_link}" target="_blank" class="apply-btn">Apply Now</a>
            <span class="posted-date">Posted ${postedDate}</span>
        </div>
    `;

    return card;
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Helper function to format job type
function formatJobType(type) {
    const types = {
        'FULLTIME': 'Full-time',
        'PARTTIME': 'Part-time',
        'CONTRACTOR': 'Contract',
        'INTERN': 'Internship'
    };
    return types[type] || type;
}

// UI Helper Functions
function showLoading() {
    loading.style.display = 'block';
    jobListings.innerHTML = '';
    resultsCount.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    jobListings.innerHTML = '';
    resultsCount.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Initial search on page load
window.addEventListener('load', () => {
    searchJobs();
});