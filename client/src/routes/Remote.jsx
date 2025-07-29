import { useParams, useSearchParams } from "react-router";
import { Outlet } from "react-router";
import { Form } from "react-router";
import Loader from "../components/Loader";
import { useRef, useState } from "react";

export default function Remote() {
  const { playerID } = useParams();
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const keywordField = useRef(null);

  return (
    <div className="pt-16">
      <Form
        action={`/${playerID}/remote/search`}
        method="get"
        className="fixed w-full p-2 z-3 mt-[-4rem]"
      >
        <input
          className="w-full bg-white p-3 rounded-full border-1"
          name="keyword"
          type="text"
          placeholder="Search YouTube"
          defaultValue={keyword}
          required
          ref={keywordField}
        />
      </Form>

      <Loader>
        <Outlet
          context={{
            clearKeyword: () => (keywordField.current.value = ""),
          }}
        />
      </Loader>
    </div>
  );
}
