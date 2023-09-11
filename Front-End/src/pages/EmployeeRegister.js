import React, { useState, useCallback } from "react";
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/EmployeeRegister.css";
import PageHeaderIconButton from "../components/PageHeader/PageHeaderIconButton";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
import PageHeaderTextButton from "../components/PageHeader/PageHeaderTextButton";
import CustomCalendar from "../components/Contents/CustomCalendar";
import CustomInput from "../components/Contents/CustomInput";
import Input from "../components/Contents/Input";
import CustomSelect from "../components/Contents/CustomSelect";
import CustomButton from "../components/Contents/CustomButton";
import CustomNumberInput from "../components/Contents/CustomNumberInput";
import CustomResidentNumberInput from "../components/Contents/CustomResidentNumberInput";
import CustomEmailInput from "../components/Contents/CustomEmailInput";
import DaumPostcode from 'react-daum-postcode';
import Table from "../components/TablesLib/Table";
import CustomModalInput from "../components/Contents/CustomModalInput";
import useApiRequest from "../components/Services/ApiRequest";
import SearchBarBox from "../components/SearchBar/SearchBarBox";
import moment from "moment";

const EmployeeRegister = () => {
  const apiRequest = useApiRequest();
  const [selectedOption, setSelectedOption] = useState("0"); // 이메일 선택값 관리
  const [openPostcode, setOpenPostcode] = useState(false); // 카카오 API 모달창 상태관리
  const [empList, setEmpList] = useState([]); // 첫번째 테이블의 사원정보들 관리
  const [selectedEmpCode, setSelectedEmpCode] = useState(null); // 현재 체크된 cdEmp 저장하는 상태
  // const [clickEmpCode, setclickEmpCode] = useState(); // 현재 클릭한 cdEmp 저장하는 상태
  const [zonecode, setZonecode] = useState(""); // 우편번호 상태 관리
  const [address, setAddress] = useState(""); // 주소 상태 관리
  
  // 사원정보 테이블 컬럼 상태관리
  const [nmEmp, setNmEmp] = useState(""); // 이름 상태 관리
  const [noResident, setNoResident] = useState(""); // 주민번호 상태 관리
  const [fgForeign, setFgForeign] = useState(0); // 내/외국인 상태 관리
  const [dtHire, setDtHire] = useState(""); // 입사일자 상태 관리
  const [fgGender, setFgGender] = useState(""); // 성별 상태 관리
  const [noPost, setNoPost] = useState(""); // 우편번호 상태 관리
  const [nmAddress, setNmAddress] = useState(""); // 주소 상태 관리
  const [dcAddress, setDcAddress] = useState(""); // 상세 주소 상태 관리
  
  // noPhone을 - 기준으로 3개로 나눠서 상태 관리
  const [noPhone1, setNoPhone1] = useState(""); // 전화번호 상태 관리
  const [noPhone2, setNoPhone2] = useState(""); // 전화번호 상태 관리
  const [noPhone3, setNoPhone3] = useState(""); // 전화번호 상태 관리
  
  // noMobilePhone을 - 기준으로 3개로 나눠서 상태 관리
  const [noMobilePhone1, setNoMobilePhone1] = useState(""); // 휴대폰번호 상태 관리
  const [noMobilePhone2, setNoMobilePhone2] = useState(""); // 휴대폰번호 상태 관리
  const [noMobilePhone3, setNoMobilePhone3] = useState(""); // 휴대폰번호 상태 관리
  
  // nmEmail을 @기준으로 나눠서 상태 관리
  const [username, setUsername] = useState(""); // 이메일 사용자명 상태 관리
  const [domain, setDomain] = useState(""); // 이메일 도메인 상태 관리

  const [cdBank, setCdBank] = useState(""); // 은행정보 상태 관리
  // const [idJoin, setIdJoin] = useState(""); // 가입 ID 상태 관리
  const [dtResign, setDtResign] = useState(""); // 퇴사일자 상태 관리
  const [noAccount, setNoAccount] = useState(""); // 계좌번호 상태 관리
  // const [nmAccountHolder, setNmAccountHolder] = useState(""); // 예금주명 상태 관리
  const [noPositionUnique, setNoPositionUnique] = useState(""); // 직급고유번호 상태 관리
  const [noDepartment, setNoDepartment] = useState(""); // 부서번호 상태 관리

  const [checkedRows, setCheckedRows] = useState([]); // 각 행의 체크박스 상태를 저장하는 상태
  const [showInsertRow, setShowInsertRow] = useState(false); // 테이블의 insertRow의 상태
  // const [cdEmp, setCdEmp] = useState("");
  // const [singleEmp, setSingleEmp] = useState(null);
  // const [detailAddress, setDetailAddress] = useState("");

  // 선택된 이메일 주소값 가져오기
  const handleSelectChange = (newValue) => {
    setSelectedOption(newValue);
  };

  // 버튼 클릭시 DaumPostcode 모달 열기
  const handleAddressButtonClick = () => {
    setOpenPostcode(true);
  }

  const handleAddressSelect = (data) => {
    console.log(`
        우편번호: ${data.zonecode}
        주소: ${data.address}
    `);
  
    setZonecode(data.zonecode); // 선택된 우편번호로 우편번호 상태 업데이트
    setAddress(data.address); // 선택된 주소로 주소 상태 업데이트
    setOpenPostcode(false); // 모달 닫기
  }

    // 테이블의 각 행을 클릭했을 때 동작을 정의하는 함수
    const handleRowClick = useCallback((empCode) => {
      setSelectedEmpCode(empCode);
      console.log(selectedEmpCode);
    }, []);

  //헤더 체크박스를 클릭할 때 호출되어, 모든 체크박스를 체크하거나 체크를 해제
  const handleHeaderCheckboxClick = useCallback(() => {
    console.log("****************************");
    console.log("****************************");
    console.log(checkedRows);
    console.log(empList.length);
    console.log(checkedRows.length);

    if (checkedRows.length !== empList.length) {
      setCheckedRows(empList.map((emp) => emp.cdEmp));
    } else {
      setCheckedRows([]);
    }
  }, [checkedRows, empList]);

  // 각 행의 체크박스를 클릭할 때 해당 행의 체크박스 상태를 업데이트
  const handleRowCheckboxClick = useCallback(
    (empCode) => {
      if (checkedRows.includes(empCode)) {
        setCheckedRows((prevCheckedRows) =>
          prevCheckedRows.filter((code) => code !== empCode),
        );
      } else {
        setCheckedRows((prevCheckedRows) => [...prevCheckedRows, empCode]);
      }
    },
    [checkedRows],
  );

  // 모달 닫기
  const closeModal = () => {
    setOpenPostcode(false);
  }

  const handleSelectInputChange = (e) => {
    setSelectedOption(e.target.value);
  }

  const data = React.useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        foreign: emp.fgForeign,
        resident: emp.noResident,
        onRowClick: () => handleRowClick(emp.cdEmp), // 여기 추가
      })),
    [empList]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: (
          // 이 체크박스는 체크된 행의 수가 전체 empList와 동일한 경우에만 체크되도록 설정 모든 행이 체크되어 있으면 이 체크박스도 체크
          <input
            type="checkbox"
            checked={checkedRows.length === empList.length}
            onChange={handleHeaderCheckboxClick}
          />
        ),
        accessor: "checkbox",
        width: "10%",
        id: "checkbox",
        Cell: ({ cell: { value }, row: { original } }) => {
          // 현재 행의 체크박스 상태를 결정 checkedRows 배열에 현재 행의 코드가 포함되어 있으면 체크박스는 체크된 상태로 표시
          const isChecked = checkedRows.includes(original.code);
          return (
            <input
              type="checkbox"
              // 행의 체크박스가 클릭될 때의 동작을 handleRowCheckboxClick 함수에 위임, 해당 행의 코드를 인자로 전달
              checked={isChecked}
              onChange={() => handleRowCheckboxClick(original.code)}
            />
          );
        },
      },
      {
        Header: "Code",
        accessor: "code",
        id: "code",
        width: "20%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const tableEmpCodeClick = (e) => {
            console.log('Code 클릭***************************');
            if (original && original.code) {
              console.log(original.code);
              handleGetSingleEmp(original.code);
            } else {
              console.log('Code is null or undefined');
            }
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onClick={tableEmpCodeClick}
              isDoubleClick={true}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "사원명",
        accessor: "employee",
        id: "employee",
        width: "20%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const tableEmpNmClick = (e) => {
            console.log('사원명 클릭***************************');
            if (original && original.code) {
              console.log(original.code);
              handleGetSingleEmp(original.code);
            } else {
              console.log('Code is null or undefined');
            }
          };
          
          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onClick={tableEmpNmClick}
              isDoubleClick={true}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "내/외",
        accessor: "foreign",
        id: "foreign",
        width: "12%",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "주민번호",
        accessor: "resident",
        id: "resident",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
    ],
    []
  );

  const handleGetEmpList = async () => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: "/api2/er/getAllEmpList",
      });
      setEmpList(responseData);
      console.log("api 이벤트 발생");
      console.log(responseData);
      console.log(responseData.length);
      console.log(empList.length);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  }

  const handleGetSingleEmp = async (cdEmp) => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/er/getEmpData?cdEmp=${cdEmp}`,
      });
      // setEmpList(responseData);
      console.log("api 이벤트 발생");
      console.log(responseData);
      // 각 컬럼에 대한 상태를 업데이트합니다.
      setNmEmp(responseData.nmEmp || "");
      setNoResident(responseData.noResident || "");
      setFgForeign(responseData.fgForeign || "");
      setDtHire(responseData.dtHire || "");
      setFgGender(responseData.fgGender || "");
      setNoPost(responseData.noPost || "");
      setNmAddress(responseData.nmAddress || "");
      setDcAddress(responseData.dcAddress || "");

      // 전화번호를 하이픈(-) 기준으로 분할하여 상태 변수에 저장
      const phoneParts = (responseData.noPhone || "").split('-');
      if (phoneParts.length === 3) {
        const [noPhone1, noPhone2, noPhone3] = phoneParts;
        setNoPhone1(noPhone1);
        setNoPhone2(noPhone2);
        setNoPhone3(noPhone3);
      } else {
        setNoPhone1("");
        setNoPhone2("");
        setNoPhone3("");
      }
      
      // 휴대폰번호를 하이픈(-) 기준으로 분할하여 상태 변수에 저장
      const mobilePhoneParts = (responseData.noMobilePhone || "").split('-');
      if (mobilePhoneParts.length === 3) {
        const [noMobilePhone1, noMobilePhone2, noMobilePhone3] = mobilePhoneParts;
        setNoMobilePhone1(noMobilePhone1);
        setNoMobilePhone2(noMobilePhone2);
        setNoMobilePhone3(noMobilePhone3);
      } else {
        setNoMobilePhone1("");
        setNoMobilePhone2("");
        setNoMobilePhone3("");
      }

      // 이메일 주소를 @ 기준으로 분할하여 각각의 상태 변수에 저장
      const [username, domain] = (responseData.nmEmail || "").split('@');
      setUsername(username || "");
      setDomain(domain || "");

      setCdBank(responseData.cdBank || "");
      setDtResign(responseData.dtResign || "");
      setNoAccount(responseData.noAccount || "");
      setNoPositionUnique(responseData.noPositionUnique || "");
      setNoDepartment(responseData.noDepartment || "");
      
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  }
  
  // dtHire를 Date 객체로 변환
  const dtHireDate = moment(dtHire).toDate();

  return (
    <>
      <div className="pageHeader">
        <div className="innerBox fxSpace">
          <PageHeaderName text="사원등록" />
          <div className="fxAlignCenter">
            <div className="btnWrapper textBtnWrap">
              <PageHeaderTextButton text="사원불러오기" onClick={handleGetEmpList} />
              <PageHeaderTextButton text="사원검색" />
              <PageHeaderTextButton text="조건검색" />
              <PageHeaderTextButton text="데이터정렬" />
            </div>
            <div className="iconBtnWrap">
              <PageHeaderIconButton
                btnName="print"
                imageSrc={Print}
                altText="프린트"
              />
              <PageHeaderIconButton
                btnName="delete"
                imageSrc={Delete}
                altText="삭제"
              />
              <PageHeaderIconButton
                btnName="calc"
                imageSrc={Calc}
                altText="계산기"
              />
              <PageHeaderIconButton
                btnName="setting"
                imageSrc={Setting}
                altText="세팅"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="section erSection">
        {/* 첫번째 그리드 */}
        <div className="erGrid">
          {/* 첫번째 테이블 */}
          <div className="erlistArea">
            <div className="namePickerBox">
              <Table
                columns={columns}
                data={data}
                insertRow={true}
                showInsertRow={showInsertRow}
                setShowInsertRow={setShowInsertRow}
              />
            </div>

            {/* 두번째 테이블 */}
            <table className="erGridBottomTable">
              <tbody>
                <tr>
                  <td>재직 / 전체</td>
                  <td>{empList.length}명 / {empList.length}명</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 두번째 그리드 */}
        <div className="erGrid2">
          {/* 제목 탭 테이블 */}
          <ul className="pageTab">
            <li className="on">기초자료</li>
          </ul>

          {/* 탭 내용 테이블 */}
          <table>
            <tbody className="borderTopBold">
              <tr>
                <th className="erHeaderStyle">입사일자</th>
                <td className="erCellStyle">
                  <CustomCalendar width={180} id="erDate1" value={dtHireDate} style={{ paddingLeft: '12px' }} />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">주민번호</th>
                <td className="erCellStyle">
                  <CustomSelect
                    className="erSelectBox"
                    options={[
                      { value: "0", label: "내국인" },
                      { value: "1", label: "외국인" },
                    ]}
                    defaultValue="0"
                  />
                </td>
                <td className="erCellStyle">
                  {/* <CustomResidentNumberInput width={180} value={noResident} style={{ paddingLeft: '12px' }}/> */}
                  <CustomInput width={180} value={noResident} style={{ paddingLeft: '12px' }}/>
                </td>
                <td className="erCellStyle">
                  <CustomSelect
                    className="erSelectBox"
                    options={[
                      { value: "0", label: "남자" },
                      { value: "1", label: "여자" },
                    ]}
                    defaultValue="0"
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">주소</th>
                <td className="erCellStyle">
                  <CustomInput width={180} value={noPost} setZonecode={setNoPost} style={{ paddingLeft: '12px' }} readOnly />
                </td>
                <td className="erCellStyle" colSpan="2">
                  <CustomInput width={370} value={nmAddress} setAddress={setNmAddress} style={{ paddingLeft: '12px' }} readOnly />
                </td>
                <td className="erCellStyle">
                  <CustomButton text="검색" color="black" onClick={handleAddressButtonClick} />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">상세주소</th>
                <td className="erCellStyle" colSpan="5">
                  <CustomInput width={845} value={dcAddress} style={{ paddingLeft: '12px' }} />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">전화번호</th>
                <td className="erCellStyle">
                  {/* <CustomNumberInput width={180} maxLength={3} /> */}
                  <CustomInput width={180} value={noPhone1} style={{ paddingLeft: '12px' }} />
                </td>
                <td className="erCellStyle">
                  {/* <CustomNumberInput width={180} maxLength={4} /> */}
                  <CustomInput width={180} value={noPhone2} style={{ paddingLeft: '12px' }} />
                </td>
                <td className="erCellStyle">
                  {/* <CustomNumberInput width={180} maxLength={4} /> */}
                  <CustomInput width={180} value={noPhone3} style={{ paddingLeft: '12px' }} />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">휴대폰번호</th>
                <td className="erCellStyle">
                  {/* <CustomNumberInput width={180} maxLength={3} /> */}
                  <CustomInput width={180} value={noMobilePhone1} style={{ paddingLeft: '12px' }} />
                </td>
                <td className="erCellStyle">
                  {/* <CustomNumberInput width={180} maxLength={4} /> */}
                  <CustomInput width={180} value={noMobilePhone2} style={{ paddingLeft: '12px' }} />
                </td>
                <td className="erCellStyle">
                  {/* <CustomNumberInput width={180} maxLength={4} /> */}
                  <CustomInput width={180} value={noMobilePhone3} style={{ paddingLeft: '12px' }} />
                </td>
                {/* disabled */}
                <td width={298}>
                  <input type="text" disabled className="erInputDisabledStyle" />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">이메일</th>
                <td className="erCellStyle">
                  <div>
                    {/* <CustomEmailInput width={180} value={username} /> */}
                    <CustomInput width={180} value={username} style={{ paddingLeft: '12px' }} />
                  </div>
                </td>
                <td className="erCellStyle">
                  <div className="email-cell">
                    <div className="at-sign">@</div>
                    {selectedOption === "0" ? (
                      <CustomInput
                        className="input-cell"
                        value={domain}
                        onChange={handleSelectInputChange}
                      />
                    ) : (
                      <CustomInput
                        className="input-cell"
                        value={selectedOption}
                        onChange={handleSelectInputChange}
                      />
                    )}
                  </div>
                </td>
                <td className="erCellStyle">
                  <SearchBarBox
                    className="erSelectBox"
                    options={[
                      { value: "0", label: "직접입력" },
                      { value: "gmail.com", label: "gmail.com" },
                      { value: "kakao.com", label: "kakao.com" },
                      { value: "nate.com", label: "nate.com" },
                      { value: "naver.com", label: "naver.com" },
                      { value: "yahoo.co.kr", label: "yahoo.co.kr" },
                    ]}
                    value={domain}
                    defaultValue={"0"}
                    onChange={handleSelectChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">부서</th>
                <td className="erCellStyle">
                  <CustomModalInput 
                    width={180} 
                    value={noDepartment} 
                    style={{ paddingLeft: '12px' }} 
                    readOnly>
                    <h2>부서</h2>
                  </CustomModalInput>
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">직급</th>
                <td className="erCellStyle">
                  <CustomSelect 
                    className="erSelectBox"
                    options={[{value:"0", label:"기본직급"}]} 
                    defaultValue="0"
                  />
                </td>
                <td className="erCellStyle">
                  <CustomSelect
                    className="erSelectBox"
                    options={[
                      { value: "1", label: "회장" },
                      { value: "2", label: "사장" },
                      { value: "3", label: "부사장" },
                      { value: "4", label: "전무" },
                      { value: "5", label: "상무" },
                      { value: "6", label: "이사" },
                      { value: "7", label: "부장" },
                      { value: "8", label: "수석" },
                      { value: "9", label: "차장" },
                      { value: "10", label: "책임" },
                      { value: "11", label: "과장" },
                      { value: "12", label: "선임" },
                      { value: "13", label: "대리" },
                      { value: "14", label: "주임" },
                      { value: "15", label: "사원" },
                      { value: "16", label: "직급없음" },
                    ]}
                    value={noPositionUnique}
                    defaultValue="0"
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">퇴사일자</th>
                <td className="erCellStyle">
                  <CustomCalendar width={180} id="erDate2" />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">급여이체은행</th>
                <td className="erCellStyle">
                  <CustomModalInput width={180} value={cdBank} style={{ paddingLeft: '12px' }} >
                    <h2>은행</h2>
                  </CustomModalInput>
                </td>
                <td className="erCellStyle">
                  <CustomInput width={180} value={noAccount} style={{ paddingLeft: '12px' }} />
                </td>
                <td className="erCellStyle">
                  <CustomInput width={180} value={nmEmp} style={{ paddingLeft: '12px' }} readOnly />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 모달 창 */}
        {openPostcode && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <DaumPostcode 
                style={{ height: "100%" }}
                onComplete={handleAddressSelect}  
                autoClose={false} 
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default EmployeeRegister;
