$(document).ready(function () {
    ShopingCart = {
        imageChange: (event) => {
            var file = URL.createObjectURL(event.target.files[0])
            console.log(file);
            if (file) {
                $('.imagePreview').attr('src', file)
            }
        }
        ,
        addToCart: (productId) => {
            $.ajax({
                url: 'add-to-cart/' + productId,
                method: 'GET',
                success: (response) => {
                    if (response.status) {
                        if ($(".cartCountDiv").text()) {
                            var count = parseInt($(".cartCountDiv").text());
                            $(".cartCountDiv").text(count + 1)
                        }
                    }
                    else
                        window.location.href = "/login"
                }

            })

        }
    }
})

