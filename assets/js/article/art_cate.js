$(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
            }
        })
    }

     // 为添加类别按钮绑定点击事件
    let indexAdd = null
    $("#btnAddCate").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })
    // 通过代理的形式，为form-add 表单绑定 submit事件
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg("新增分类失败")
                }
                // 重新获取分类列表
                initArtCateList()
                layer.msg("新增分类成功")
                // 关闭对话框
                layer.close(indexAdd)

            }
        })
    })

    let indexEdit = null
    // 通过代理的形式，为form-edit 表单绑定 submit事件
    $("tbody").on("click", "#btnEditCate", function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        });

        let Id = $(this).attr("data-Id")
        // console.log(id);
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + Id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // console.log(res);
                    return layer.msg("更新分类数据失败！")
                }
                layer.msg("更新分类数据成功！")
                // 关闭弹出层
                layer.close(indexEdit)
                // 重新渲染页面
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $("body").on("click", ".btn-del",function (e) {
        e.preventDefault()
        let id = $(this).attr("data-id")
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 提示用户是否要删除
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                seccess: function(res) {
                    if(res.status !== 0) {
                        return layer.msg("删除文章失败")
                    }
                    
                    layer.msg("删除文章成功")
                    layer.close(index);
                    initArtCateList()
                }
            })

            
        });
    })



})












