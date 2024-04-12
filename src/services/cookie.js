// Fonction pour récupérer la valeur d'un cookie
export function getCookie(name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) {
        return match[2];
    }
    return null;
}
