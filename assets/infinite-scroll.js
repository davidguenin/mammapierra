class InfiniteScroll {
  constructor() {
    this.button = document.querySelector('.infinite-scroll-button');
    if (!this.button) return;

    this.loading = document.querySelector('.infinite-scroll-loading');
    this.productGrid = document.querySelector('#product-grid');

    this.button.addEventListener('click', this.loadMoreProducts.bind(this));
  }

  loadMoreProducts() {
    const nextUrl = this.button.dataset.nextUrl;
    if (!nextUrl) {
      this.button.remove();
      return;
    }

    this.showLoading();
    this.button.style.display = 'none';

    fetch(nextUrl)
      .then((response) => response.text())
      .then((text) => {
        const html = new DOMParser().parseFromString(text, 'text/html');
        const newProducts = html.querySelectorAll('#product-grid > .grid__item');
        const newButton = html.querySelector('.infinite-scroll-button');

        newProducts.forEach((product) => {
          this.productGrid.appendChild(product);
        });

        if (newButton && newButton.dataset.nextUrl) {
          this.button.dataset.nextUrl = newButton.dataset.nextUrl;
          this.button.style.display = 'block';
        } else {
          this.button.remove();
        }

        this.hideLoading();
      })
      .catch((error) => {
        console.error('Error loading more products:', error);
        this.hideLoading();
        this.button.style.display = 'block';
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
