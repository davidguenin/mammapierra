class InfiniteScroll {
  constructor() {
    this.trigger = document.querySelector('.infinite-scroll-trigger');
    if (!this.trigger) return;

    this.loading = document.querySelector('.infinite-scroll-loading');
    this.productGrid = document.querySelector('#product-grid');
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      rootMargin: '0px 0px 200px 0px',
    });
    this.observer.observe(this.trigger);
  }

  handleIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.loadMoreProducts();
      }
    });
  }

  loadMoreProducts() {
    const nextUrl = this.trigger.dataset.nextUrl;
    if (!nextUrl) {
      this.observer.unobserve(this.trigger);
      this.trigger.remove();
      return;
    }

    this.showLoading();

    fetch(nextUrl)
      .then((response) => response.text())
      .then((text) => {
        const html = new DOMParser().parseFromString(text, 'text/html');
        const newProducts = html.querySelectorAll('#product-grid > .grid__item');
        const newTrigger = html.querySelector('.infinite-scroll-trigger');

        newProducts.forEach((product) => {
          this.productGrid.appendChild(product);
        });

        if (newTrigger && newTrigger.dataset.nextUrl) {
          this.trigger.dataset.nextUrl = newTrigger.dataset.nextUrl;
        } else {
          this.trigger.remove();
          this.observer.unobserve(this.trigger);
        }

        this.hideLoading();
      })
      .catch((error) => {
        console.error('Error loading more products:', error);
        this.hideLoading();
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
