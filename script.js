
gsap.registerPlugin(ScrollTrigger);

// page 2 animations 

const container = document.querySelector('.container');
const sections = gsap.utils.toArray('.container section');
const mask = document.querySelector('.mask');

let scrollTween = gsap.to(sections, {
    xPercent: -430,
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
const button = document.querySelector('.form-submit')
button.addEventListener('click',sendMail)

function sendMail(){
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    }

    const serviceID = 'service_qfmvlmr'
    const templateID = 'template_0jxzgyq'

    emailjs.send(serviceID, templateID, data)
        .then(
            res =>{
                document.getElementById('name').value = "";
                document.getElementById('email').value = "";
                document.getElementById('message').value = "";
                console.log(res)
                alert("Email sent successfully")
            })
        .catch((err) => {console.log(err)});
}




//smooth scroll
const lenis = new Lenis()

lenis.on('scroll', (e) => {
  console.log(e)
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)