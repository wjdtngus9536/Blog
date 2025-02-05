module.exports = {
    // handlebars 템플릿 엔진의 헬퍼 함수 사용 방법은 .hbs 파일의 내부에서 아래와 같이 작성
    // {{함수명 변수1}}
    // e.g, 작성일시 : {{dateString createdDt}}
    // {{함수명1(함수명2 변수1 변수2) 변수1}}
    // e.g, {{#if  (eq .@root.paginator.page)}}eq 테스트{{/if}}
    // 리스트 길이 반환 함수
    lengthOfList : (list = []) => list.length,

    // 두 값이 같은지 비교해 여부를 반환
    eq: (val1, val2) => val1 === val2,

    // 표준시간대의 시간을 우리나라의 시간으로 변환
    dateString: (isoString) => {
        const date = new Date(isoString);
        const today = new Date();
        const isToday = date.getDate() === today.getDate() && 
                        date.getMonth() === today.getMonth() && 
                        date.getFullYear() === today.getFullYear();
        // 오늘 날짜면 시간만 반환
        if(isToday) {
            return date.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12:false
            });
        // 오늘 날짜가 아니면 날짜 01.30 과 같은 형식으로 반환
        } else {
            return date.toLocaleDateString('ko-KR', {
                month: '2-digit',
                day: '2-digit',
            }).slice(0, -1);
        }
        // return new Date(isoString).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    },

    uppercase: (text) => text.toUpperCase()
};