class InfiniteScroll {
  constructor() {
    this.button = document.querySelector('.infinite-scroll-button');
    this.trigger = document.querySelector('.infinite-scroll-trigger');

    if (this.button) {
      this.button.addEventListener('click', this.loadMoreProducts.bind(this));
    } else if (this.trigger) {
      this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
        rootMargin: '0px 0px 200px 0px',
      });
      this.observer.observe(this.trigger);
    } else {
      return;
    }

    this.loading = document.querySelector('.infinite-scroll-loading');
    this.productGrid = document.querySelector('#product-grid');
  }

  handleIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.loadMoreProducts();
      }
    });
  }

  loadMoreProducts() {
    let url;
    if (this.button) {
      url = this.button.dataset.nextUrl;
    } else if (this.trigger) {
      url = this.trigger.dataset.nextUrl;
    }

    if (!url) {
      if (this.button) this.button.remove();
      if (this.trigger) {
        this.observer.unobserve(this.trigger);
        this.trigger.remove();
      }
      return;
    }

    this.showLoading();
    if (this.button) this.button.style.display = 'none';

    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const html = new DOMParser().parseFromString(text, 'text/html');
        const newProducts = html.querySelectorAll('#product-grid > .grid__item');
        const newTrigger = html.querySelector('.infinite-scroll-trigger');
        const newButton = html.querySelector('.infinite-scroll-button');

        newProducts.forEach((product) => {
          this.productGrid.appendChild(product);
        });

        if (this.button) {
          if (newButton && newButton.dataset.nextUrl) {
            this.button.dataset.nextUrl = newButton.dataset.nextUrl;
            this.button.style.display = '';
          } else {
            this.button.remove();
          }
        }

        if (this.trigger) {
          if (newTrigger && newTrigger.dataset.nextUrl) {
            this.trigger.dataset.nextUrl = newTrigger.dataset.nextUrl;
          } else {
            if (this.trigger) {
              this.observer.unobserve(this.trigger);
              this.trigger.remove();
            }
          }
        }

        this.hideLoading();
      })
      .catch((error) => {
        console.error('Error loading more products:', error);
        this.hideLoading();
        if (this.button) this.button.style.display = '';
      });
  }

  showLoading() {
    if (this.loading) {
      this.loading.style.display = 'block';
    }
  }

  hideLoading() {
    if (this.loading) {
      this.loading.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new InfiniteScroll();
});
