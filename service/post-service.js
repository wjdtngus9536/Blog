// 비지니스 로직 처리 (핵심 로직 구현, 데이터 처리, 복잡한 계산이나 데이터 변환 작업)
// 트랜잭션 관리 (여러 데이터베이스 작업을 하나의 트랜잭션으로 관리)
// 추상화 계층 제공 (컨트롤러는 구체적인 데이터 처리 방식을 알 필요가 없음, DB나 외부 API호출 등의 세부사항을 숨김)
// API 응답용 DTO(Data Transfer Object) 반환
// 요약 : 서비스 레이어는 비지니스 로직 처리, 컨트롤러는 요청/응답 처리, 리포지토리는 데이터 접근 처리


const { createPaginator } = require('../utils/paginator');

/**
 * 새로운 게시글을 데이터베이스에 작성합니다.
 * @async
 * @param {import('mysql2').Connection} db - mysql2 모듈의 Connection 객체
 * @param {Object} post - 게시글 정보 객체
 * @param {string} post.title - 게시글 제목
 * @param {string} post.writer - 게시글 작성자
 * @param {string} post.password - 게시글 비밀번호
 * @param {string} post.content - 게시글 내용
 * @returns {Promise<Object>} - 게시글 작성 결과를 담은 객체
 */
async function writePost(db, post) {
    post.hits = 0;
    post.createdDt = new Date().toISOString(); // 날짜는 ISO 포맷으로 저장
    const queryString = `INSERT INTO post (title, writer, password, content, hits, createdDt) VALUES(?, ?, ?, ?, ?, ?);`;
    const values = [post.title, post.writer, post.password, post.content, post.hits, post.createdDt];

    const [results, fields] = await db.execute(queryString, values);
    console.log('체크 results from db.execute', results);
    console.log('체크 fileds from db.execute', fields);
    return results;
}

/**
 * 게시글 목록을 페이지네이션과 함께 조회합니다.
 * @async
 * @param {import('mysql2/promise').Connection} db - MySQL 데이터베이스 커넥션 객체
 * @param {number} page - 조회할 페이지 번호
 * @param {string} search - 검색 키워드
 * @returns {Promise<[Array<Object>, Object]>} 게시글 목록과 페이지네이터 객체를 포함하는 배열
 * @returns {Array<Object>} returns[0] - 게시글 목록(게시글 id, title, writer, hits, createdDt, 댓글 개수)
 * @returns {Object} returns[1] - 페이지네이터 객체
 */
async function list(db, page, search) {
    const perPage = 10;
    // LIKE ? : % 와일드 카드를 사용하여 검색어가 제목에 포함된 모든 게시글을 찾는다.
    // 와일드 카드: search% = search로 시작하는 문자열 찾기, %search = search로 끝나는 문자열 찾기.
    // limit a, b : a번째 부터 그 후 b개 출력
    const queryString = `
        SELECT p.id, p.title, p.writer, p.hits, p.createdDt, count(c.cid) AS commentCount FROM post p LEFT JOIN comment c ON p.id = c.post_id WHERE p.title LIKE ? AND p.is_deleted = ? GROUP BY p.id ORDER BY p.id DESC LIMIT ?, ?;
    
    `;
    const values = [`%${search}%`, 0, (page - 1) * perPage, perPage];
    const [posts, fields] = await db.execute(queryString, values);
    const [cntQueryResult, _] = await db.execute(`SELECT COUNT(*) FROM post WHERE title LIKE ?;`, [`%${search}%`]);
    const totalCount = cntQueryResult[0]['COUNT(*)'];
    
    // 홈 화면에서 게시글의 제목 옆에 해당 게시글의 댓글이 몇 개인지도 출력하고자 한다 쿼리를 어떻게 수정해야 할까?
    

    // 페이지네이션 객체 생성
    const paginatorObj = createPaginator(totalCount, page, perPage );
    return [posts, paginatorObj];
}

async function getPost(db, id) {
    // 조회수 증가
    const updateQueryString = `UPDATE post SET hits = hits + 1 WHERE id = ?;`;
    const updateValues = [id];
    const [updateResults, updateFields] = await db.execute(updateQueryString, updateValues);

    // 조회수 증가 후 게시글 조회
    const queryString = `SELECT * FROM post WHERE id = ?;`;
    const values = [id];
    const [post, fields] = await db.execute(queryString, values);
    return post[0];
}

async function writeComment(db, comment) {
    comment.createdDt = new Date().toISOString();

    const queryString = `INSERT INTO comment (content, createdDt, name, password, post_id) VALUES(?, ?, ?, ?, ?);`;
    const values = [comment.comment, comment.createdDt, comment.name, comment.password, comment.postId];
    const [results, fields] = await db.execute(queryString, values);
    return results;
}

// 잘못 설계한듯 input output 다시 정리
/**
 * @param {import('mysql2').Connection} db - mysql2 모듈의 Connection 객체
 * @param {*} id 
 * @param {*} password 
 * @returns - id와 pw에 일치하는 값 존재시 true 부재시 false
 */
async function checkPassword(db, id, password) {
    const queryString = `SELECT * FROM post WHERE id = ? AND password = ?;`;
    const values = [id, password];
    const [results, fields] = await db.execute(queryString, values);
    console.log('체크 results in service.checkPassword', results);
    return Boolean(results[0]);
}

async function getPostById(db, id) {
    const queryString = `SELECT * FROM post WHERE id = ?;`; 
    const values = [id];
    const [post, fields] = await db.execute(queryString, values);
    console.log('체크 post in service.getPostById', post);
    return post;
}

async function modifyPost(db, post) {
    const queryString = `UPDATE post SET title = ?, writer = ?, password = ?, content = ? WHERE id = ?`;
    const values = [post.title, post.writer, post.password, post.content, post.id];
    const [results, fields] = await db.execute(queryString, values);
    console.log(`[log] query results from service.modifyPost`, results);
    return results;ㅣ
}

async function getComments(db, p_id) {
    const queryString = `SELECT c.cid, c.content, c.createdDt, c.name FROM comment c JOIN post p ON c.post_id = p.id WHERE p.id = ? AND c.is_deleted = ?;`;
    const values = [p_id, 0];
    
    const [comments, fields] = await db.execute(queryString, values);
    return comments;
}

// post를 삭제할거면 하위 comment도 다 삭제되게 설계
// soft delete 적용
async function deletePostById(db, id, password) {
    const queryString = `UPDATE post SET is_deleted = ? WHERE id = ? AND password = ?;`;
    const values = [1, id, password];
    const [results, fields] = await db.execute(queryString, values);
    console.log('[Log] 서비스에 post 삭제 함수에서 실행한 UPDATE 쿼리의 결과', results);
    return results;
}

async function deleteComment(db, cid, password) {
    const queryString = `UPDATE comment SET is_deleted = ? WHERE cid = ? AND password = ?;`;
    const values = [1, cid, password];

    const [results, fields] = await db.execute(queryString, values);
    console.log('--------------------------------\n[Log] 댓글 삭제 쿼리 결과\n', results);

    return results;
}

module.exports = {
    modifyPost,
    getPostById,
    writePost,
    list,
    getPost,
    writeComment,
    checkPassword,
    getComments,
    deletePostById,
    deleteComment,
}