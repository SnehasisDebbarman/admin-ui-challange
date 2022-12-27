import "./App.css";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TbEdit } from "react-icons/tb";
import { MdDoneAll } from "react-icons/md";
function Item({
  item,
  deleteAnItem,
  updateAnItem,
  editActive,
  updatedItemSubmit,
  setEditActive,
  CheckedData,
  setCheckedData,
}) {
  const [itemName, setItemName] = useState(item.name);
  const [itemEmail, setItemEmail] = useState(item.email);
  const [itemRole, setItemRole] = useState(item.role);
  return (
    <div
      style={{
        display: "grid",
        width: "90%",
        gridTemplateColumns: "20% 20% 20% 20% 20%",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        padding: "10px",
      }}
    >
      <div>
        <input
          checked={CheckedData.includes(item.id)}
          type="checkbox"
          id={item.id}
          name={item.name}
          value={item}
          onClick={() => {
            setCheckedData((CheckedData) => [
              ...new Set([...CheckedData, item.id]),
            ]);
          }}
        />
      </div>
      {editActive !== item.id ? (
        <div>{item.name}</div>
      ) : (
        <input
          style={{
            width: "70%",
          }}
          defaultValue={itemName}
          onChange={(e) => {
            e.preventDefault();
            setItemName(e.target.value);
          }}
        />
      )}
      {editActive !== item.id ? (
        <div>{item.email}</div>
      ) : (
        <input
          style={{
            width: "70%",
          }}
          defaultValue={itemEmail}
          onChange={(e) => {
            e.preventDefault();
            setItemEmail(e.target.value);
          }}
        />
      )}
      {editActive !== item.id ? (
        <div>{item.role}</div>
      ) : (
        <input
          style={{
            width: "70%",
          }}
          defaultValue={itemRole}
          onChange={(e) => {
            e.preventDefault();
            setItemRole(e.target.value);
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          gap: "5px",
        }}
      >
        <button
          style={{
            all: "unset",
          }}
        >
          {editActive !== item.id ? (
            <TbEdit
              onClick={() => {
                updateAnItem(item.id);
              }}
            />
          ) : (
            <MdDoneAll
              onClick={() => {
                setEditActive(-1);
                updatedItemSubmit({
                  id: item.id,
                  name: itemName,
                  email: itemEmail,
                  role: itemRole,
                });
              }}
            />
          )}
        </button>
        <button
          style={{
            all: "unset",
          }}
        >
          <AiOutlineDelete
            onClick={() => {
              deleteAnItem(item.id);
            }}
            color="red"
          />
        </button>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState([]);
  const [pages, setPages] = useState([]);
  const [CurrentPageData, setCurrentPageData] = useState([]);
  const [PageNum, setPageNum] = useState(1);
  const [SearchText, setSearchText] = useState("");
  const [editActive, setEditActive] = useState(-1);
  const [CheckedData, setCheckedData] = useState([]);

  function setPagesArray(res) {
    let p = [];
    for (let i = 0; i < Math.ceil(res.length / 10); i++) {
      p.push(i);
    }
    setPages(p);
  }

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setPagesArray(res);
        setCurrentPageData(data.slice(0, 10));
      });
  }, []);

  useEffect(() => {
    let startIndex = (PageNum - 1) * 10;
    let endIndex = PageNum * 10;
    Search(SearchText);
    setCurrentPageData(data.slice(startIndex, endIndex));
  }, [PageNum, data]);

  function deleteAnItem(id) {
    let filteredData = data.filter((item) => {
      return item.id !== id;
    });
    setData(filteredData);
  }
  function updateAnItem(id) {
    setEditActive(id);
  }
  function updatedItemSubmit(item) {
    console.log("Updated item", item);
    let updatedData = data.map((it) => {
      if (it.id === item.id) {
        it = item;
      }
      return it;
    });
    setData(updatedData);
  }

  function Search(searchKeyWord) {
    let newData = [];
    let nameSearchData = data.filter((item) => {
      return item.name.toLowerCase().includes(searchKeyWord.toLowerCase());
    });
    let emailSearchData = data.filter((item) => {
      return item.email.toLowerCase().includes(searchKeyWord.toLowerCase());
    });
    let roleSearchData = data.filter((item) => {
      return item.role.toLowerCase().includes(searchKeyWord.toLowerCase());
    });
    newData = [
      ...new Set([...nameSearchData, ...roleSearchData, ...emailSearchData]),
    ];
    setCurrentPageData(newData.slice(0, 10));
    setPagesArray(newData);
  }
  function checkAllCurrentData() {
    if (CheckedData.length < 10) {
      setCheckedData(CurrentPageData.map((it) => it.id));
    } else {
      setCheckedData([]);
    }
  }

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "50px",
        }}
      >
        <input
          placeholder="Search by name, email or role"
          onChange={(e) => {
            setSearchText(e.target.value);
            Search(e.target.value);
          }}
          style={{
            padding: "0.5%",
            width: "90%",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <div
          style={{
            display: "grid",
            width: "90%",
            gridTemplateColumns: "20% 20% 20% 20% 20%",
            fontWeight: "bolder",
            borderBottom: "1.5px solid rgba(0, 0, 0, 0.3)",
            paddingBottom: "10px",
            padding: "10px",
          }}
        >
          <div>
            <input
              onChange={() => {
                checkAllCurrentData();
              }}
              type="checkbox"
              id={""}
              name={""}
              value={""}
            />
          </div>
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Action</div>
        </div>

        {CurrentPageData.map((item) => {
          return (
            <Item
              item={item}
              editActive={editActive}
              deleteAnItem={deleteAnItem}
              updateAnItem={updateAnItem}
              updatedItemSubmit={updatedItemSubmit}
              setEditActive={setEditActive}
              CheckedData={CheckedData}
              setCheckedData={setCheckedData}
            ></Item>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          padding: "20px 0",
        }}
      >
        <button
          disabled={PageNum === 1 ? true : false}
          onClick={() => {
            setPageNum(1);
          }}
          className="changePageBtn"
        >
          {"<<"}
        </button>
        <button
          disabled={PageNum === 1 ? true : false}
          onClick={() => {
            setPageNum((pNum) => pNum - 1);
          }}
          className="changePageBtn"
        >
          {"<"}
        </button>
        {pages.map((page) => {
          return (
            <div
              style={{
                height: "50px",
                width: "50px",
                border: "1px solid blue",
                borderRadius: "50%",
                backgroundColor: PageNum === page + 1 ? "white" : "blue",
                borderColor: "blue",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: PageNum === page + 1 ? "blue" : "white",
              }}
              onClick={() => {
                setPageNum(page + 1);
              }}
            >
              <div>{page + 1}</div>
            </div>
          );
        })}
        <button
          disabled={PageNum === pages.length ? true : false}
          onClick={() => {
            setPageNum((pNum) => pNum + 1);
          }}
          className="changePageBtn"
        >
          {">"}
        </button>
        <button
          disabled={PageNum === pages.length ? true : false}
          onClick={() => {
            setPageNum(pages.length);
          }}
          className="changePageBtn"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

export default App;
