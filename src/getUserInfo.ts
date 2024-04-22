async function getUserInfoHandler(request: any, reply: any) {
  console.info(request.params, request.query);
  return {
    username: "fellowed",
  };
}

// export { getUserInfoHandler };
export default getUserInfoHandler;