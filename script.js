
gsap.registerPlugin(ScrollTrigger);

const portfolioData = [
    {
        company: "Coforge",
        role: "AI/ML Engineer Intern",
        mission: "Built a root cause analysis engine to diagnose and fix failures in large-scale microservice applications, reducing the manual issue resolution process for SRE's.",
        tech: [
            "Cloud: Docker (ECR), Kubernetes (EKS)",
            "Data: PySpark, PyG Graph Neural Networks",
            "AI: LightRAG, Neo4j Knowledge Graphs, Faiss, Redis",
            "Inference: vLLM, OpenAI API, FastAPI"
        ],
        icons: ["docker", "kubernetes", "PyTorch", "fastapi", "python"]
    },
    {
        company: "Rutgers Aresty",
        role: "Research Assistant",
        mission: "Developed a multiplayer system for scientific experiments that allows multiple users to interact concurrently with minimal delay.",
        tech: [
            "Engine: Unity & C# (.NET)",
            "Cloud: Firebase Real-time Database",
            "Systems: Concurrent non-blocking data streams",
            "Analytics: Time-series data logging"
        ],
        icons: ["unity", ".NET", "firebase", "Python"]
    },
    {
        company: "BlaZop",
        role: "SWE Intern",
        mission: "Developed an intelligent chatbot to help clients navigate Blazop's SaaS platform and automated the generation of training data from internal documents.",
        tech: [
            "Web: Angular, Python",
            "AI: LLaMA 3.1, LangChain, Ollama",
            "Storage: ChromaDB (Vector Database)",
            "Vision: OpenAI CLIP image embeddings"
        ],
        icons: ["angular", "docker", "python", "Ollama", "langchain"]
    },
    {
        company: "First Move Partners",
        role: "SWE Intern",
        mission: "Built a central dashboard for hospital administrators to track staff and medical resources in real-time to improve operational efficiency.",
        tech: [
            "Frontend: React, Axios",
            "Backend: Node.js, Express.js",
            "Database: MongoDB",
            "API Testing: Postman"
        ],
        icons: ["react", "nodedotjs", "mongodb", "postman"]
    },
    {
        company: "Clueless",
        role: "Open Source Contributor",
        mission: "Built a desktop application that allows users to have voice and text conversations with AI about whatever is currently on their screen.",
        tech: [
            "App: Electron, React, TypeScript",
            "Logic: Python, FastAPI, WebSockets",
            "Systems: Asyncio, threading, cross-thread event loops",
            "AI: Ollama API integration"
        ],
        icons: ["electron", "react", "typescript", "fastapi", "python"]
    },
    {
        company: "NBA Terminal",
        role: "ML & Data Science",
        mission: "Designed a model to predict player points daily and built a real-time suite for NBA analytics and strategy validation.",
        tech: [
            "Models: XGBoost Regressor, Scikit-learn",
            "Data: NBA API, NumPy, Pandas",
            "Logic: Mean Reversion & Zone Matchup Score"
        ],
        icons: ["Numpy", "scikitlearn", "pandas", "python"]
    },
    {
        company: "Movie Recommender",
        role: "ML & Data Science",
        mission: "Engineered a movie recommendation system that predicts which films a user will enjoy based on their past viewing history and ratings.",
        tech: [
            "Compute: Apache Spark, Python",
            "Libraries: NumPy, Pandas",
            "Algorithm: Matrix Factorization (SVD)",
            "Visualization: Matplotlib, Seaborn"
        ],
        icons: ["numpy", "apachespark", "pandas", "python"]
    }
];

const portfolioCardsContainer = document.getElementById('portfolio-cards-row');
if (portfolioCardsContainer) {
    portfolioData.forEach(item => {
        portfolioCardsContainer.innerHTML += `
            <section class="card-holder-section">
                <div class="card">
                    <div class="company-header">${item.company}</div>
                    <div class="role-subtitle">${item.role}</div>
                    <div class="mission-statement">${item.mission}</div>
                    <ul class="tech-list">
                        ${item.tech.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                    <div class="footer-icons">
                        ${item.icons.map(icon => `
                            <img class="icon-svg" src="https://cdn.simpleicons.org/${icon}" alt="${icon}" />
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    });
}

const skillsData = [
    {
        category: "Dev Tools",
        skills: [
            { name: "Docker", icon: "docker" },
            { name: "GitHub", icon: "github" },
            { name: "VSC", icon: "vs-code-svgrepo-com.svg" },
            { name: "Git", icon: "git" },
            { name: "Claude Code", icon: "claude" },
            { name: "Postman", icon: "postman" },
            { name: "Github Copilot", icon: "githubcopilot" },
            { name: "Linux", icon: "linux" },
        ]
    },
    {
        category: "Front-End",
        skills: [
            { name: "React", icon: "react" },
            { name: "Angular", icon: "angular-svgrepo-com.svg" },
            { name: "HTML", icon: "html5" },
            { name: "CSS", icon: "css" },
            { name: "Tailwind", icon: "tailwindcss" },
            { name: "Bootstrap", icon: "bootstrap" },
            { name: "Figma", icon: "figma-svgrepo-com.svg" },
            { name: "GSAP", icon: "greensock" }
        ]
    },
    {
        category: "Data",
        skills: [
            { name: "Azure", icon: "azure-svgrepo-com.svg" },
            { name: "Firebase", icon: "firebase" },
            { name: "AWS", icon: "aws-svgrepo-com.svg" },
            { name: "ChromaDB", icon: "ChromaDB.svg" },
            { name: "GCP", icon: "googlecloud" },
            { name: "MongoDB", icon: "mongodb" },
            { name: "Spark", icon: "apachespark" },
            { name: "Hadoop", icon: "apachehadoop" }
        ]
    },
    {
        category: "AI/ML",
        skills: [
            { name: "PyTorch", icon: "pytorch" },
            { name: "TensorFlow", icon: "tensorflow" },
            { name: "Scikit-learn", icon: "scikitlearn" },
            { name: "OpenAI API", icon: "openai-svgrepo-com.svg" },
            { name: "Hugging Face", icon: "huggingface" },
            { name: "Ollama", icon: "ollama" },
            { name: "LangChain", icon: "langchain" },
            { name: "Anthropic API", icon: "anthropic" }
        ]
    },
    {
        category: "Languages",
        skills: [
            { name: "Python", icon: "python" },
            { name: "JavaScript", icon: "javascript" },
            { name: "Java", icon: "java-4-logo-svgrepo-com.svg" },
            { name: "C++", icon: "cplusplus" },
            { name: "C", icon: "c" },
            { name: "TypeScript", icon: "typescript" },
            { name: "SQL", icon: "postgresql" },
            { name: "Assembly", icon: "assembly-svgrepo-com.svg" }
        ]
    },
];

const skillsCardsContainer = document.getElementById('skills-cards-row');
if (skillsCardsContainer) {
    skillsData.forEach(item => {
        skillsCardsContainer.innerHTML += `
            <section class="card-holder-section">
                <div class="card">
                    <div class="company-header">${item.category}</div>
                    <div class="tech-grid">
                        ${item.skills.map(s => {
                            const iconUrl = s.icon.endsWith('.svg') 
                                ? `icons/svgs/${s.icon}` 
                                : `https://cdn.simpleicons.org/${s.icon}`;
                            return `
                                <div class="tech-grid-item">
                                    <img class="tech-grid-icon" src="${iconUrl}" alt="${s.name}" />
                                    <span>${s.name}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;
    });
}

//home page animations
const homePage = document.querySelector('.homepage')
const page1 = document.querySelector('.page-1')
const cardContainer = document.querySelector('.card-container')

let homePageTransition = gsap.timeline({
    scrollTrigger: {
        trigger: cardContainer,
        toggleActions: 'play none none none',
        start: 'top 0',
        pin: true,
        scrub: 1,
        markers: false,
        end: "+=1500px",
    }
})

homePageTransition.to(cardContainer, {})


let page1ToHomePage = gsap.timeline({
    scrollTrigger: {
        trigger: cardContainer,
        toggleActions: 'play none none none',
        start: '0 0',
        scrub: 1,
        end: "+=1500px",
        snap: 1,
        markers: false,
    }
})



page1ToHomePage.to(page1, {
    yPercent: -(page1.offsetHeight / homePage.offsetHeight) * 100,
    end: "+=1500px",
    ease: "power1.inOut",
})


// page 2 animations 
const container = document.querySelector('.container');
const sections = gsap.utils.toArray('.container section');
const mask = document.querySelector('.mask');

let scrollTween = gsap.to(sections, {
    // xPercent: -430,
    xPercent: -110 * (sections.length - 1.5),
    ease: "none",
    scrollTrigger: {
        trigger: ".container",
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => {
            const containerWidth = container.offsetWidth;
            const lastSection = sections[sections.length - 1];
            const lastSectionRight = lastSection.offsetLeft + lastSection.offsetWidth;
            const viewportWidth = window.innerWidth;
            const scrollEnd = lastSectionRight - containerWidth + 1 * (viewportWidth / 100);
            return `+=${scrollEnd}`;
        },
    }
});

gsap.to(mask, {
    width: '100%',
    scrollTrigger: {
        trigger: '.page-2',
        start: 'top left',
        end: () => {
            const containerWidth = container.offsetWidth;
            const lastSection = sections[sections.length - 1];
            const lastSectionRight = lastSection.offsetLeft + lastSection.offsetWidth;
            const viewportWidth = window.innerWidth;
            const scrollEnd = lastSectionRight - containerWidth + 1 * (viewportWidth / 100);
            return `+=${scrollEnd}`;
        },
        scrub: 1,
    }
});

// GSAP animations for page 3

const skillsContainer = document.querySelector('.skills-page-container');
const skillsSections = gsap.utils.toArray('.skills-page-container section');
const skillsSectionmask = document.querySelector('.mask2');

let scrollTween2 = gsap.from(skillsSections, {
    xPercent: -90 * (skillsSections.length - 1.5),
    ease: "none",
    scrollTrigger: {
      trigger: ".skills-page-container",
      pin: true,
      scrub: 1,
      snap: 1 / (skillsSections.length - 1),
      end: () => {
        const containerWidth = skillsContainer.offsetWidth;
        const lastSection = skillsSections[skillsSections.length - 1];
        const lastSectionRight = lastSection.offsetLeft + lastSection.offsetWidth;
        const viewportWidth = window.innerWidth;
        const scrollEnd = lastSectionRight - containerWidth + 30 * (viewportWidth / 100);
        return `+=${scrollEnd}`;
      },
    }
  });

gsap.from(skillsSectionmask, {
    width: '100%',
    scrollTrigger: {
        trigger: '.skills-page',
        start: 'top left',
        end: () => {
            const containerWidth = skillsContainer.offsetWidth;
            const lastSection = skillsSections[skillsSections.length - 1];
            const lastSectionRight = lastSection.offsetLeft + lastSection.offsetWidth;
            const viewportWidth = window.innerWidth;
            const scrollEnd = lastSectionRight - containerWidth + 30 * (viewportWidth / 100);
            return `+=${scrollEnd}`;
        },
        scrub: 1,
    }
});

//GSAP animations for page 3
const page3 = document.querySelector('.page-3')
const element1 = document.querySelector('.front-end-skills')
const element2 = document.querySelector('.data-management-api-skills')
const element3 = document.querySelector('.functional-skills')
const element4 = document.querySelector('.back-end-skills')


let tl = gsap.timeline({
    scrollTrigger: {
        trigger: page3,
        toggleActions: 'play none pause pause',
        pin: true,
        markers: false,
        end: "+=3000px",
    }
})

tl.to(page3,{})




//move element 1 to element 2's position
let tlEle1 = gsap.timeline({
    scrollTrigger: {
        trigger: page3,
        toggleActions: 'play none none none',
        start: '0 0',
        end: 'bottom 30%',
        scrub: 1,
        end: "+=3000px",
        snap: 1/4,
        // once: true,
    }
})


for(let i=0;i<4;i++){
    tlEle1.to(element1, {
        left: () =>{
            var element2Positions = element2.getBoundingClientRect()
            return Math.ceil(element2Positions.left)
        },
        top: () =>{
            var element2Positions = element2.getBoundingClientRect()
            return Math.ceil(element2Positions.top)
        },
        ease: "power1.inOut",
        opacity: () =>{
            if(i===3){
                return 1
            }
            else{
                return 0.1
            }
        },
    })
}
//move element 2 to element 3's position
let tlEle2 = gsap.timeline({
    scrollTrigger: {
        trigger: page3,
        toggleActions: 'play none none none',
        start: '0 0',
        end: 'bottom 30%',
        scrub: 1,
        end: "+=3000px",
        snap: 1/4,
        // once: true,
    }
})

for(let i=0;i<4;i++){
    tlEle2.to(element2, {
        left: () =>{
            var element3Positions = element3.getBoundingClientRect()
            return Math.ceil(element3Positions.left)
        },
        top: () =>{
            var element3Positions = element3.getBoundingClientRect()
            return Math.ceil(element3Positions.top)
        },
        ease: "power1.inOut",
        opacity: () =>{
            if(i===2){
                return 1
            }
            else{
                return 0.1
            }
        },
    })
}

//move element 3 to element 4's position
let tlEle3 = gsap.timeline({
    scrollTrigger: {
        trigger: page3,
        toggleActions: 'play none none none',
        start: '0 0',
        end: 'bottom 30%',
        scrub: 1,
        end: "+=3000px",
        snap: 1/4,
        // once: true,
    }
})


for(let i=0;i<4;i++){
    tlEle3.to(element3, {
        left: () =>{
            var element4Positions = element4.getBoundingClientRect()
            return Math.ceil(element4Positions.left)
        },
        top: () =>{
            var element4Positions = element4.getBoundingClientRect()
            return Math.ceil(element4Positions.top)
        },
        ease: "power1.inOut",
        opacity: () =>{
            if(i===1){
                return 1
            }
            else{
                return 0.1
            }
        },
    })
}

//move element 4 to element 1's position
let tlEle4 = gsap.timeline({
    scrollTrigger: {
        trigger: page3,
        toggleActions: 'play none none none',
        start: '0 0',
        end: 'bottom 30%',
        scrub: 1,
        end: "+=3000px",
        snap: 1/4,
        // once: true,
    }
})

for(let i=0;i<4;i++){
    tlEle4.to(element4, {
        left: () =>{
            var element1Positions = element1.getBoundingClientRect()
            return Math.ceil(element1Positions.left)
        },
        top: () =>{
            var element1Positions = element1.getBoundingClientRect()
            return Math.ceil(element1Positions.top)
        },
        ease: "power1.inOut",
        opacity: () =>{
            if(i===0){
                return 1
            }
            else{
                return 0.1
            }
        }
    })
}






//text animations

const splitTypes = document.querySelectorAll('.text-animation-112')

splitTypes.forEach((char,i)=>{
    const text = new SplitType(char,{types: 'chars, words'})

    gsap.from(text.chars,{
        scrollTrigger: {
            trigger: char,
            start: 'top 80%',
            end: 'top 20%',
            scrub: false,
        },
        opacity: 0.2,
        stagger: 0.03,
        duration: 1,
    })
})

//page home page to page 1 transtion

let timel = gsap.timeline({
    scrollTrigger: {
        trigger: ".page-1",
        start: "top 35%",
        end: "bottom top",
        scrub: false,
        toggleActions: 'play none none reverse'
    }
})

timel.to('.displacement', {
        attr: {
            r: 1600
        },
        
        duration: 1.5
    })

//nav menu popping

let scale = 1
function zoom(){
    if(scale===1){
        scale = 1.1
        menuLogo.style.transform = `scale(${scale})`;
    }else{
        scale = 1
        menuLogo.style.transform = `scale(${scale})`;
       

    }
}
let zoomInterval = setInterval(zoom, 1000);

//nav bar transtion
const menuLogo = document.querySelector(".menu-logo");
const navbar = document.querySelector('.header-navbar')

let clickedOnce = false;
menuLogo.addEventListener('click', function (event) {
    clearInterval(zoomInterval)
    clickedOnce = !clickedOnce
    if (clickedOnce) {
        rotate180()
    } else {
        rotate360()
    }
});

function rotate180() {
    menuLogo.style.transform = 'rotate(180deg)'
    navbar.classList.remove('translate-right')
    navbar.classList.add('translate-left')
    navbar.style.opacity = "1";
}

function rotate360() {
    menuLogo.style.transform = 'rotate(0deg)'
    navbar.classList.remove('translate-left')
    navbar.classList.add('translate-right')
    navbar.style.opacity = "0";


}

//email sender
document.addEventListener('DOMContentLoaded',  () => {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        sendMail();
    });
});
function sendMail(){
    const button = document.querySelector('.form-submit')
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    }

    const serviceID = 'service_h4cc44g'
    const templateID = 'template_2uics96'

    if(data.name===''||data.email===''||data.message===''){
        return
    }
    
    emailjs.send(serviceID, templateID, data)
        .then(
            res => {
                document.getElementById('name').value = "";
                document.getElementById('email').value = "";
                document.getElementById('message').value = "";
                button.textContent = "Sent!";
                setTimeout(()=>{
                    button.textContent = "Send Message";
                },3000)
            })
        .catch((err) => { console.log(err) });
}

//copy email function
const emailButton = document.querySelector('.email-image')
const modal = document.querySelector('.dialog-text')
emailButton.addEventListener('click', ()=>{
  navigator.clipboard.writeText('kashyapt.business@gmail.com');
  modal.show();
  setTimeout(closeModal,1000)
})
function closeModal(){
    modal.close()
}

//Page navigations
const homePageLink1 = document.querySelector('#home-page-link')
homePageLink1.addEventListener('click', () =>{
    document.querySelector('#home-page').scrollIntoView({ behavior: 'smooth' });
})

const homePageLink2 = document.querySelector('#home-page-link-2')
homePageLink2.addEventListener('click', () =>{
    document.querySelector('#home-page').scrollIntoView({ behavior: 'smooth' });
})

// const aboutPageLink = document.querySelector('#about-page-link')
// aboutPageLink.addEventListener('click', () =>{
//     document.querySelector('.page-1').scrollIntoView({ behavior: 'smooth' });
// })

const contactPageLink = document.querySelector('#contact-page-link')
contactPageLink.addEventListener('click', () =>{
    document.querySelector('#contacts-page').scrollIntoView({ behavior: 'smooth' });
})

//code to create link onclick on small github logo on the projects card


//smooth scroll
// const lenis = new Lenis()

// function raf(time) {
//   lenis.raf(time)
//   requestAnimationFrame(raf)
// }

// requestAnimationFrame(raf)

const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)