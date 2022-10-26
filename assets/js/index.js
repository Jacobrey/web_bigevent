$(function(){
    // 调用 getUserInfo 获取用户基本信息
    getUserinfo()
    let layer = layui.layer
    // 点击退出事件
    $("#btnLogout").on("click", function(){
        layer.confirm('确定退出吗？', {icon: 3, title:'提示'}, function(index){
            // 1、清楚localSrorage中的token
            localStorage.removeItem("token")
            // 2、跳转到登录界面
            location.href = "/login.html"
            layer.close(index);
          });
    })
})

function getUserinfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem("token")||''
        // },
        success: function(res) {
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败');
            }
            // console.log(res.data)
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
            
        }

        // // 不论成功还是失败，最终都会调用 complete 回调函数
        // complete: function(res){
        //     console.log("执行了complete 回调函数");
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //             // 1. 强制清空 token
        //             localStorage.removeItem('token')
        //             // 2. 强制跳转到登录页面
        //             location.href = '/login.html'
        //           }
        //     }

    })

}

function renderAvatar(user){
    // 获得登录的用户名称
    let name = user.nickname || user.username
    // 设置欢迎的文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    // 按需渲染用户的头像 判断是否有头像图片
    if(user.user_pic !== null) {
        $(".layui-nav-img")
            .attr("src",user.user_pic)
            .show()
        $(".text-avatar").hide()
    }else{
        $(".layui-nav-img").hide()
        let first = name[0].toUpperCase()
        $(".text-avatar")
            .html(first)
            .show()
    }

}