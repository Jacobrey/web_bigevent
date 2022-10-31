$(function () {
    // 表单验证
    let form = layui.form
    let layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function(value) {
            if(value === $("input[name = oldPwd]").val()) {
                return '两次密码不能一样！'
            }
        },
        repwd: function(value) {
            if(value !== $("input[name = newPwd]").val()) {
                return '两次输入密码不一致！'
            }
        }
    })

    // 修改密码 表单提交
    $(".layui-form").on("submit", function(e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !==0 ) {
                    return layer.msg("修改密码失败")
                }
                layer.msg("修改密码成功")
                // 密码提交后，将表单置为空
                // 将表单转换为 dom 元素，调用reset方法
                $(".layui-form")[0].reset()
                
            }
        })
    })
    // 重置
    $("#btnReset").on("click", function (e) {
        // 阻止表单默认行为
        e.preventDefault()

    })

})