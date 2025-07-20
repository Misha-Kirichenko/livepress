import ErrorPage from "../ErrorPage";

const BlockedPage = () => {
  return <ErrorPage status={403} text="Your account has been blocked" />;
};

export default BlockedPage;
