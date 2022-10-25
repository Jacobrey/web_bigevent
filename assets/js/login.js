$(function() {
    // 点击到注册页面
    $("#link_reg").on('click', function() {
        $(".login-box").hide()
        $(".reg-box").show()
    })

    // 点击登录
    $("#link_login").on('click', function() {
        $(".login-box").show()
        $(".reg-box").hide()
    })

    // 从 layui 中获取 form 对象
    let form = layui.form
    // 从 layui 中获取 layer（弹出层） 对象
    let layer = layui.layer
    // 通过 form.verify() 自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 注册表单的验证 验证两次密码是否一致
        repwd:function(value){
            // value 拿到的是确认密码框中的内容
            let pwd = $('.reg-box input[name=password]').val()
            if(pwd !== value){
                return '两次输入的密码不一致'
            }
        }
    })

    // 监听表单注册事件
    $("#reg-form").on("submit", function(e){
        // 1、阻止表单的默认行为
        e.preventDefault()
        // 向服务器发起ajax的post请求
        $.ajax({
            type:'POST',
            url:'/api/reguser',
            data: {username:$(".reg-box [name=username]").val(),password:$(".reg-box [name=password]").val()},
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
            
            layer.msg('注册成功！请登录');
            $("#link_login").click()
            }
        })
        
    })

     // 监听表单登录事件
     $("#login-form").submit(function(e){
        // 1、阻止表单的默认行为
        e.preventDefault()
        // 2、发起 ajax 请求注册
        $.ajax({
            type:'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0 ) {
                    return layer.msg('登录失败，请重试！')
                }
                layer.msg("登录成功！")
                // console.log(res.token);
                // 登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem("token", res.token)
                // 跳转到后台主页
                location.href = './index.html'
            }
        })
     })
    
})