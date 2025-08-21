class InfiniteScroll {
  constructor() {
    this.container = document.querySelector('[data-pagination-container]');
    if (!this.container) return;

    this.paginationType = this.container.dataset.paginationType;
    this.productGrid = this.container.querySelector('#product-grid');
    this.loading = this.container.querySelector('.infinite-scroll-loading');

    if (this.paginationType === 'load_more') {
      this.button = this.container.querySelector('.infinite-scroll-button');
      if (this.button) {
        this.button.addEventListener('click', this.loadMoreProducts.bind(this));
      }
    } else if (this.paginationType === 'infinite') {
      this.setupIntersectionObserver();
    }
  }

  setupIntersectionObserver() {
    const lastProduct = this.productGrid.querySelector('.grid__item:last-child');
    if (!lastProduct) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.observer.unobserve(lastProduct);
            this.loadMoreProducts();
          }
        });
      },
      { rootMargin: '0px 0px 400px 0px' }
    );

    this.observer.observe(lastProduct);
  }

  loadMoreProducts() {
    let url = this.container.dataset.nextUrl;
    if (!url) {
      if (this.button) this.button.remove();
      return;
    }

    this.showLoading();
    if (this.button) this.button.style.display = 'none';

    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const html = new DOMParser().parseFromString(text, 'text/html');
        const newGrid = html.querySelector('#product-grid');
        const newProducts = newGrid.querySelectorAll('.grid__item');
        const newContainer = html.querySelector('[data-pagination-container]');

        newProducts.forEach((product) => {
          this.productGrid.appendChild(product);
        });

        if (newContainer && newContainer.dataset.nextUrl) {
          this.container.dataset.nextUrl = newContainer.dataset.nextUrl;
        } else {
          this.container.removeAttribute('data-next-url');
          if (this.button) this.button.remove();
        }

        this.hideLoading();

        if (this.button) {
          if (this.container.hasAttribute('data-next-url')) {
            this.button.style.display = '';
          }
        } else if (this.paginationType === 'infinite') {
          if (this.container.hasAttribute('data-next-url')) {
            this.setupIntersectionObserver();
          }
        }
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
