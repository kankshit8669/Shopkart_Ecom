class ProductQueryBuilder {
    constructor(databaseQuery, urlParams = {}) {
        this.query = databaseQuery;
        this.params = urlParams;
    }

    search() {
        const text = (this.params.keyword || '').trim();
        if (!text) return this;
        const keyword = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        this.query = this.query.where('name').regex(new RegExp(keyword, 'i'));
        return this;
    }

    filter() {
        const { keyword, page, limit, ...otherFilters } = this.params;
        const conditions = {};
        Object.keys(otherFilters).forEach(name => {
            const value = otherFilters[name];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const bounds = {};
                ['gt', 'gte', 'lt', 'lte'].forEach(comparison => {
                    if (value[comparison] !== undefined) bounds[`$${comparison}`] = value[comparison];
                });
                if (Object.keys(bounds).length) conditions[name] = bounds;
            } else {
                conditions[name] = value;
            }
        });
        this.query = this.query.find(conditions);
        return this;
    }

    pagination(pageSize) {
        const requested = parseInt(this.params.page, 10);
        const current = Number.isFinite(requested) && requested > 0 ? requested : 1;
        this.query = this.query.skip((current - 1) * pageSize).limit(pageSize);
        return this;
    }
}

module.exports = ProductQueryBuilder;
