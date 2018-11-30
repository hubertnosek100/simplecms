app.ui = app.ui ? app.ui : {};
app.ui.pager = (function () {
    var obj = {};

    obj.page = 0;
    obj.limit = 10;

    obj.nav = $('<nav class="w-100 d-flex justify-content-center" aria-label="Page navigation"></nav>');
    obj.ul = $('<ul class="pagination"></ul>')

    obj.next = {
        li: $('<li class="page-item"></li>'),
        a: $('<a class="page-link">></a>')
    }

    obj.previous = {
        li: $('<li class="page-item"></li>'),
        a: $('<a class="page-link"><</a>')
    }

    obj.previous.a.on('click',function(){
        obj.page = obj.page - 1;
        obj.callback();
    })

    obj.next.a.on('click',function(){
        obj.page = obj.page + 1;
        obj.callback();
    })

    obj.build = function () {
        return this.nav.append(
            this.ul.append(
                this.previous.li.append(this.previous.a)
            ).append(
                this.next.li.append(this.next.a)
            ));
    }

    obj.getQuery = function(){
        return "?_page=" + this.page + "&_limit=" + this.limit;
    }

    obj.onChanged = function (callback) {
        this.callback = callback;
    }

    obj.reset = function(){
        obj.limit = 10;
        obj.page = 0;
    }

    return obj;
}());