
gsap.registerPlugin(ScrollTrigger);

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
    xPercent: -100 * (sections.length - 1.5),
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
        onLeaveBack: function() {
            tl.progress(0).kill()
        },
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
            console.log(Math.ceil(element1Positions.left))
            return Math.ceil(element1Positions.left)
        },
        top: () =>{
            var element1Positions = element1.getBoundingClientRect()
            return Math.ceil(element1Positions.top)
        },
        ease: "power1.inOut",
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

    const serviceID = 'service_qfmvlmr'
    const templateID = 'template_0jxzgyq'

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