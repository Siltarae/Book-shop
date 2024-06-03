try {
  lalala; // 에러, 변수가 정의되지 않음!
} catch (error) {
  //  JavaScript의 표준 에러 객체

  console.log(error.name); // ReferenceError
  console.log(error.message); // lalala is not defined
  console.log(error.stack); // ReferenceError: lalala is not defined at ... (호출 스택)

  // 이때, 에러 객체는 "name: message" 형태의 문자열로 변환됩니다.**
  console.log(error); // ReferenceError: lalala is not defined
}
