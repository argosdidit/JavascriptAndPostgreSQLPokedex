$(function() {

    // ✅ 表示
    $("#btn-show").on("click", function() {
        $("#box").fadeIn();
    });

    // ✅ 非表示
    $("#btn-hide").on("click", function() {
        $("#box").fadeOut();
    });

    // ✅ トグル（表示/非表示）
    $("#btn-toggle").on("click", function() {
        $("#box").slideToggle();
    });

    // ✅ CSS の変更
    $("#btn-color").on("click", function() {
        $("#box").css("background", "tomato");
    });

    // ✅ Ajax（ダミー）
    $("#btn-ajax").on("click", function() {
        $("#result").text("読み込み中...");

        // ダミーの Ajax（実際の通信はしない）
        setTimeout(function() {
            $("#result").text("Ajax の結果を受信しました！");
        }, 1000);
    });

});
