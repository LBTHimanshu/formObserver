class WORKFLOW {
    constructor() {
        this.topHead = document.getElementsByClassName("top-head-container")[0];
        this.wrapper = document.getElementsByClassName("right-workflow-container")[0];
        this.catBlockEle = document.getElementsByClassName("category-bottom")[0];
        this.appData = {
            categoryData: window.categoryData,
            cardData: window.cardData,
            nicheData: window.nichesData
        };
        this.init();
    }
    init() {
        this.wrapper.innerHTML = "";
        this.catBlockEle.innerHTML = "";
        this.topHead.innerHTML = "";
        this.nicheData = null;
        this.categoryData = null;
        this.url = (new URL(document.location)).searchParams;
        this.filterDataFromUrl(this.url)
        this.loadNiches();
        this.listenToEvent(this.nicheData);
        this.addListener();
    }

    // filter url data
    filterDataFromUrl(url){
        if(url.get("cate")&&url.get("niche")){
            this.categoryData = url.get("cate");
            this.nicheData = url.get("niche");
        }
    }
    // load the niches into DOM;
    loadNiches() {
        this.appData.nicheData.forEach((niche) => {
            this.topHead.innerHTML += `
            <div role="listitem" class="top-head">
            <p id=${niche.nicheSlug} data-head="niche" class="para-18 head-para">${niche.nicheName}</p>
            </div>`;
        })
    }
    // filter out cards based on categories.
    renderFiltered(showOnNiche) {
        this.wrapper.innerHTML = '';
        this.appData.categoryData.filter((category) => category.showOnNiche === showOnNiche).forEach((category) => {
            const cardsHtml = this.loadCards(this.appData.cardData, category.categorySlug, showOnNiche)
            const headHtml = this.loadHead(category, showOnNiche);
            const cardContainerHtml = this.loadCardContainer(cardsHtml);
            this.loadWrapper(headHtml, cardContainerHtml, category);
        })
    }
    // function to load cards.
    loadCards(data, categoryName, nicheName) {
        const CARDHTML = data.filter((card) => card.showOn === categoryName && card.showOnNiche === nicheName).map((card) => {
            if (card != null) {
                return `<a href="https://element5.webflow.io/workflow-category-items/${card.link}" role="listitem" class="workflow-card">
        <img src=${card.cardImgSrc} loading="lazy" alt="" class="workflow-card-img">
            <p class="para-16 workflow-card-head">${card.cardName}</p>
            <p class="para-16 workflow-card-para">${card.cardDetails}</p>
            <p class="know-more-link card-link">Know More</p>
            </a>`.toString().split(',').join('');
            }
        });
        return CARDHTML;
    }
    // function to load heading of the card container.
    loadHead(category, showOnNiche) {
        if (category.showOnNiche == showOnNiche) {
            return `<div class="right-top-block"><h2 class="workflow-heading">${category.categoryTitle}</h2><p class="para-16 width-60">${category.categoryDesc}</p></div>`;
        }
    }
    // function to add cards and heading into the container.
    loadCardContainer(cards) {
        if (cards.length != 0) {
            let container = document.createElement('div');
            container.className = "right-bottom-block";
            cards.forEach(card => {
                container.innerHTML += card;
            });
            return container;
        }
    }
    // function to add card container and head container into a wrapper:
    loadWrapper(headHtml, cardContainer, category) {
        if (headHtml != undefined && cardContainer != undefined) {
            let headCardWrapper = document.createElement("div");
            let line = document.createElement("div");
            headCardWrapper.classList.add("right-workflow-wrapper");
            line.classList.add("horizontal-line");
            line.classList.add("line");
            headCardWrapper.id = category.categorySlug;
            headCardWrapper.innerHTML = headHtml;
            headCardWrapper.appendChild(cardContainer);
            headCardWrapper.appendChild(line);
            this.wrapper.appendChild(headCardWrapper);
            this.cardEvents();
        }
        else if (headHtml == undefined && cardContainer == undefined) {
            let headCardWrapper = document.querySelectorAll(".right-workflow-wrapper");
            headCardWrapper.forEach((wrp) => {
                if (wrp.id == category.categorySlug) {
                    let Ele = document.getElementById(wrp.id);
                    let parent = Ele.parentElement;
                    parent.removeChild(wrp);
                }
            })
        }
    }
    // function to listen card events
    cardEvents() {
        let cards = document.querySelectorAll(".workflow-card")
        cards.forEach(card => {
            card.addEventListener("mouseover", (eve) => {
                let targetEle = eve.currentTarget;
                let link = targetEle.childNodes[7];
                link.style.opacity = 1;
            })
            card.addEventListener("mouseout", (eve) => {
                let targetEle = eve.currentTarget;
                let link = targetEle.childNodes[7];
                link.style.opacity = 0;
            })
        })
    };
    // function to listen to events.
    listenToEvent(data) {
        let headBlock = document.querySelectorAll(".head-para");
        if(data){
            let activeNiche = document.getElementById(data);
            activeNiche.classList.add("active");
            this.categoryFilter(activeNiche.id);
            this.nicheData = null;
        }else{
            headBlock[0].classList.add("active");
            this.categoryFilter(headBlock[0].id);
        }
        this.topHead.addEventListener("click", (e) => {
            if (e.target.dataset.head == "niche") {
                let id = e.target.id;
                this.categoryFilter(id);
                headBlock.forEach(head => {
                    if (head.classList.contains("active")) {
                        head.classList.remove("active");
                    }
                    e.target.classList.add("active")
                })
                this.addListener();
            }
        });
    }
    // filter out categories based on niches.
    categoryFilter(id) {
        const CATHTML = this.getCategoryDom(this.appData.categoryData, id);
        this.renderFiltered(id);
        this.loadCategoryDom(CATHTML, this.categoryData);
    }
    // get the niches DOM.
    getCategoryDom(data, categoryName) {
        const CATDOM = data.filter((category) => category.showOnNiche === categoryName).map((category) => {
            return `<a href="#" data-id="${category.categorySlug}" role="listitem" class="categories-block flexbox"><img src=${category.categoryImg} loading="lazy" alt="${categoryName}" class="catrgory-img"><p class="para-16 para-category">${category.categoryTitle}</p></a>`.toString().split(',').join('');
        });
        return CATDOM;
    }
    // load DOM into Container.
    loadCategoryDom(Dom, category) {
        this.catBlockEle.innerHTML = '';
        Dom.forEach(ele => {
            this.catBlockEle.innerHTML += ele;
        })
        let catBlock = document.querySelectorAll(".categories-block.flexbox");
        if (catBlock.length != 0) {
            if(category){
                let activeCat = document.querySelector(`[data-id = ${category}]`);
                activeCat.classList.add("active-left-border");
                activeCat.children[1].classList.add("active-para");
                this.scrollFromTop(category);
                this.categoryData = null;
            }
            else{
                catBlock[0].classList.add("active-left-border");
                catBlock[0].children[1].classList.add("active-para");
            }
            catBlock.forEach(cat => {
                cat.addEventListener("click", (eve) => {
                    let id = eve.currentTarget.dataset.id;
                    this.scrollFromTop(id);
                })
            })
        }
    }
    addListener() {
        let wrapperBlock = document.querySelectorAll(".right-workflow-wrapper");
        wrapperBlock.forEach(wrapper => {
            this.observeScroll(wrapper)
        })
    }
    observeScroll(wrapper) {
        this.observer = new IntersectionObserver((wrapper) => {
            if (wrapper[0]['isIntersecting'] == true) {
                let elID = wrapper[0].target.id;
                this.activateCategory(elID);
            }
        }, { root: null, threshold: 0, rootMargin: '-200px' });
        this.observer.observe(wrapper);
    }
    activateCategory(id) {
        document.querySelectorAll(".categories-block.flexbox").forEach(cat => {
            if (cat.classList.contains("active-left-border")) {
                cat.classList.remove("active-left-border");
                cat.children[1].classList.remove("active-para");
            }
            if (cat.dataset.id == id) {
                cat.classList.add("active-left-border");
                cat.children[1].classList.add("active-para");
            }
        })
    }
    // scroll the page when clicked on any category.
    scrollFromTop(id) {
        let el = document.getElementById(id);
        let elDistanceToTop = window.pageYOffset + el.getBoundingClientRect().top;
        window.scrollTo({
            top: elDistanceToTop - 110,
            behavior: 'smooth'
        });
    }
    // add the left border into the categories.
    removeActive(eve) {
        let box = eve.currentTarget.closest(".flexbox");
        document.querySelectorAll(".categories-block.flexbox").forEach(cat => {
            if (cat.classList.contains("active-left-border") && (cat.children[1].classList.contains("active-para"))) {
                cat.classList.remove("active-left-border");
                cat.children[1].classList.remove("active-para");
            }
        })
        box.classList.add("active-left-border");
    }

}
new WORKFLOW;