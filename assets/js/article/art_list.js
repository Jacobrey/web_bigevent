$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;


    let p = {
        pagenum: '1',
        pagesize: '2',
        cate_id: '',
        state: '',
    }
    // 使用过滤器 格式化时间
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = dt.getMonth + 1
        let d = dt.getDate()

        let hh = dt.getHours()
        let mm = dt.getMinutes()
        let ss = dt.getSeconds()

        return y + '-' + m + '-' + d + "" + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg("加载数据失败")
                }
                console.log(res);
                layer.msg("加载数据成功")
                template("tpl-table", res)
                renderPage(res.total)
            }
        })
    }

    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg("获取分类数据失败！")
                }
                layer.msg("获取分类数据成功")
                console.log(res);
                let strHTML = template("tpl-cate", res)
                $("[name=cate_id]").html(strHTML)
                form.render()

            }
        })
    }

    // 为表单绑定提交事件
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        let cate_id = $("[name=cate_id]").val()
        let state = $("[name=state]").val()

        p.cate_id = cate_id
        p.state = state

        initTable()
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,   //数据总数，从服务端得到
            limit: p.pagesize,  // 每页显示的条数
            curr: p.pagenum, // 起始页
            layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                p.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                p.pagesize = obj.limit
                //首次不执行
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    //do something
                    initTable()
                }
            }
        })
    }

    // 通过代理删除数据
    $("tbody").on("click", ".btn-del", function (e) {
        e.preventDefault()
        let id = $(".btn-del").attr("data-id")
        let len = $(".btn-del").length

        console.log(len)

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })
})