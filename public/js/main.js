$(document).ready(function () {
    $('.deleteFood').on('click', deleteFood)
    $('.updateFood').on('click', getFood)
})

function deleteFood () {
    var confirmation = confirm('Are You Sure?')

    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/foods/delete/' + $(this).data('id')
        }).done(function (response) {
            window.location.replace('/')
        })
        window.location.replace('/')
    } else {
        return false;
    }
}

function getFood () {
    window.location.replace('/foods/update/' + $(this).data('id'))
}