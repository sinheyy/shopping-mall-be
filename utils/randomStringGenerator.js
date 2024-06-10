// orderNum 만들기
function getCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' };
    const formattedDate = today.toLocaleDateString('ko-KR', options);

    // '-' 문자와 공백을 제거하고 숫자만 반환합니다.
    return formattedDate.replace(/[.\s-]/g, '');
}

const randomStringGenerator = () => {
    let randomString = Array.from(Array(10), () =>
        Math.floor(Math.random() * 36).toString(36))
        .join("");

    const today = getCurrentDate();
    randomString = today + randomString.toUpperCase();

    return randomString;
}

module.exports = { randomStringGenerator };