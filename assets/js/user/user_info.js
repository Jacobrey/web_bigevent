$(function(){
    // 通过 form.verify() 自定义校验规则
    let form = layui.form
    let layer = layui.layer

    form.verify({
        nickname: function(value) {
            if(value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    // 初始化用户信息
    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo(){
        $.ajax({
            type:'GET',
            url: '/my/userinfo',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res.data);
                // 快速给表单赋值
                form.val('formUserInfo', res.data);
            }

        })
    }

    $("#btnReset").on('click', function(e){
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $(".layui-form").on("submit",function(e) {
        // 阻止表单的默认行为
        e.preventDefault();
        // 发起ajax 请求 更新
        $.ajax({
            type:"POST",
            url:"/my/userinfo",
            data:$(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg("用户信息更新失败")
                }
                layer.msg("用户信息更新成功")
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent. getUserinfo()
            }
        })

    })

})