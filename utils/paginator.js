const lodash = require('lodash');
const PAGE_LIST_SIZE = 10;

module.exports = {
    // paginator란? : list service의 
    // 구현하고자 하는 로직은? : user가 보고싶은 page 정보가 올텐데 해당 페이지의 10단위의 주변 페이지를 보여준다.
    // e.g, 1페이지면 1 ~ PAGE_LIST_SIZE, 10 페이지면 1 ~ 10, 11페이지면 11 ~ 20, 13페이지면 11 ~ 20
    createPaginator : (totalCount, page, perPage = 10) => {
        const totalPage = Math.ceil(totalCount / perPage);
        // case 11, 13, 20인 경우 셋 다 start = 11, end = 20이 나올 수 있어야 한다.
        // case 10인 경우는 start = 1, end = 10이 나오게 해야 한다.
        const pageGroupIndex = Math.floor(page / perPage);
        // console.log(pageGroupIndex);
        // 0번 그룹과 10도 0번 그룹으로 처리하기 위한 나머지 연산으로 처리 후, 몫에 페이지당 포스트 수를 곱해서 startPage를 구한다.
        // pageList 배열을 만들 때 start와 end만 잘 만들면 된다.
        // 10의 배수인 경우에만 그룹 인덱스를 -1 빼줘서 그룹을 맞춰준다
        const startPage = page % perPage === 0 ? (pageGroupIndex -1) * perPage + 1 : pageGroupIndex * perPage + 1;

        // 31 ~ 40까지 표현하려고 해도 34페이지까지 밖에 없는 상황도 고려해야 한다.
        // totalPage가 34라면 startPage가 31이고 기본값인 endPage는 startPage + perPage -1 = 40일텐데 endPage는 34가 되어야 한다면 endPage = totalPage로 설정해서 해결.
        let endPage = startPage + perPage -1;
        if (endPage > totalPage) {
            endPage = totalPage;
        }
        const paginator = {
            startPage,
            endPage,
            prevPage: page - 1,
            hasPrev : page > 1,
            pageList: lodash.range(startPage, endPage + 1),
            page,
            hasNext: page < totalPage,
            nextPage: page + 1,
            lastPage: totalPage
        }
        // console.log(paginator);

        return paginator;
    },
};



    // /**
    //  * 페이지네이션 객체 생성: 템플릿 엔진에서 
    //  * @param {number} totalCount 게시글 수
    //  * @param {number} page 현재 페이지
    //  * @param {number} perPage 페이지당 게시글 수
    //  * @returns 페이지네이터 객체
    //  */
    // // 현재 10page를 클릭했을 때 페이지네이션이 11 ~ 20으로 나타나는 버그 발생
    // createPaginator: (totalCount, page, perPage = 10) => {
    //     const PER_PAGE = perPage;
    //     const totalPage = Math.ceil(totalCount / PER_PAGE);
        
    //     // 1~10 다음은 11 ~ 20 과 같은 형식의 페이지네이션을 위한 시작 페이지 계산을 위해 
    //     let pageGroupIndex = Math.ceil(page / PAGE_LIST_SIZE); // 현재 페이지가 10의 공배수인지 확인하여
    //     if(page % PAGE_LIST_SIZE !== 0) { // 10의 공배수가 아니라면 
    //         pageGroupIndex -= 1; // 1을 빼주는데 이 의미는 10의 공배수가 아닐 때는 startPage를 몫에 10을 곱한 값에 +1을 한 값이 항상 n or 1n or 2n이 된다는 것.
    //     }

    //     // const startPage = pageGroupIndex * PAGE_LIST_SIZE + 1; // 01 or 11 or 21 등으로 시작하게 됨
    //     // let endPage = startPage + PAGE_LIST_SIZE - 1; // 시작 페이지가 1이라면 endpage는 10이 됨, 시작 페이지가 11이라면 endpage는 20이 됨
    //     // const totalPage = Math.ceil(totalCount / PER_PAGE); // 총 페이지 수를 계산
    //     // if(endPage > totalPage) { // 만약 끝 페이지가 총 페이지 수보다 크다면 e.g, 12페이지까지 있을 때 페이지네이션의 시작은 11이 되니 endPage는 20이 되는데 이는 없는 페이지이므로
    //     //     endPage = totalPage; // 끝 페이지를 총 페이지 수로 설정
    //     // }

    //     const startPage = pageGroupIndex * PAGE_LIST_SIZE + 1;
    //     const endPage = startPage + PAGE_LIST_SIZE - 1 < totalPage ? startPage + PAGE_LIST_SIZE - 1 : totalPage;
    //     const isFirstPage = page === 1;
    //     const isLastPage = page === totalPage;
    //     const hasPrev = page > 1;
    //     const hasNext = page < totalPage;

    //     const paginatorObj = {
    //         pageGroupIndex,
    //         pageList: lodash.range(startPage, endPage + 1),
    //         page,
    //         prevPage: page - 1,
    //         nextPage: page + 1,
    //         startPage,
    //         lastPage: totalPage,
    //         hasPrev,
    //         hasNext,
    //         isFirstPage,
    //         isLastPage,
    //     }
    //     console.log(paginatorObj);
    //     return paginatorObj;
    // }   