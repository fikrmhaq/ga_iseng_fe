import React, { useEffect, useState } from "react"
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { Card, CardBody, Collapse, Form, FormGroup, Input, Label, Modal, ModalBody } from "reactstrap"
import theme from "./theme.json"
import sdm from "./sdm.json"
import { DetailView, InputRate, PredictedSkeleton, UserList } from "./Components";
import dataproject from './projects.json'
import { calculate_day_of_year, calculate_requirements, calculate_sdm, then_get } from "./function";

const App = () => {

  const [projects, setProjects] = useState(
    [

    ]
  )

  const [additionalProjects, setAdditional] = useState(
    [

    ]
  )

  const [values, setValues] = useState(
    [

    ]
  )

  const [attr, setAttr] = useState(
    []
  )

  const [selected, setSelected] = useState(
    []
  )

  const [selectedFittest, setSelectedFittest] = useState(null)

  const [generations, setGenerations] = useState(
    []
  )

  const [detailviewmode, setDetailViewMode] = useState(
    false
  )

  const [kategori, setKategori] = useState(
    ["Kepentingan", "Deadline", "SDM", "Requirements", "Demand"]
  )

  const [inputModal, setInputModal] = useState(false)
  const [input, setInput] = useState(
    {
      nama: null,
      kepentingan: null,
      demand: null,
      deadline: null,
      requirements: {
        frontend: 0,
        backend: 0
      }
    }
  )

  const [usercollapse, setCollapse] = useState(false)


  const Post = () => {

    axios.post("http://localhost:8000/items/",
      {
        "projects": projects,
        "values": values
      }
    ).then(res => {
      setSelected(res.data.final[0].map((el, i) => {
        if (el == 1) {
          return projects[i]
        } else {
          return null
        }
      }).filter(a => a !== null))

      setSelectedFittest(res.data.final[1])
      setGenerations(res.data.generations)
    })
  }


  useEffect(() => {
    if (selectedFittest == null) {
      setProjects(
        dataproject.map(el => el.nama)
      )

      setValues(
        dataproject.map(el => {
          return [
            el.kepentingan,
            10 - (el.deadline / 30),
            calculate_sdm(el.requirements.frontend, el.requirements.backend, sdm),
            calculate_requirements(el.requirements.frontend, el.requirements.backend, sdm),
            el.demand
          ]
        })
      )

      setAttr(
        dataproject.map(el => {
          return {
            sdm: sdm.filter(a => a.role == "frontend").filter(a => a.skill >= el.requirements.frontend)
              .concat(sdm.filter(a => a.role == "backend").filter(a => a.skill >= el.requirements.backend))
          }
        })
      )
    } else {
      if (selectedFittest == 0) {
        Post()
      }
    }

  }, [selectedFittest])

  const addAdditional = () => {
    setProjects([...projects, input.nama])
    setAttr([...attr, { 
      
      sdm: sdm.filter(a => a.role == "frontend").filter(a => a.skill >= input.requirements.frontend) 
      .concat(sdm.filter(a => a.role == "backend").filter(a => a.skill >= input.requirements.backend))
    
    }])

    setValues(
      [...values,
      [
        input.kepentingan,
        calculate_day_of_year(new Date(input.deadline)) - calculate_day_of_year(new Date()),
        calculate_sdm(input.requirements.frontend, input.requirements.backend, sdm),
        calculate_requirements(input.requirements.frontend, input.requirements.backend, sdm),
        input.demand
      ]
      ]
    )

    setInputModal(!inputModal)
  }

  return (
    <div>
      <div style={{ margin: 'auto', width: '75%', marginTop: '70px' }} >

        <div class="d-flex justify-content-between mb-3">
          <div class="font-card-title" style={{ fontSize: '29px' }}>Prioritas</div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button class="btn" style={{ border: '1px solid', borderColor: '#eaedf1' }} onClick={() => Post()}>Predict</button>
            <button class="btn btn-primary" style={{ marginLeft: '10px' }} onClick={() => setInputModal(!inputModal)}>Input Another</button>
          </div>
        </div>
        <div class="row">
          {
            selected.length == 0 ? <></>
              :
              selectedFittest != 0 ?
                selected.map((item, i) => {
                  const month = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Dec"]
                  const now = new Date().getDate() + " " + month[new Date().getMonth()]
                  const then = then_get(item.deadline)

                  return (
                    <div class="col-sm-3 mb-2">

                      <div class="card" style={selected.length != 0 ? {
                        boxShadow: 'none', backgroundColor: theme[i].card, borderRadius: '8px',
                        border: 'none'
                      } : {}}>
                        <div style={{ padding: '30px' }}>
                          <div class="font-card" style={selected.length != 0 ? { color: theme[i].title, fontSize: '21px' } : {}}>{item}</div>
                          <div class="font-card" style={selected.length != 0 ? { color: theme[i].subtitle, fontSize: '17px' } : {}}>{now}</div>
                          <div style={{ marginTop: '50px' }}>
                            {
                              attr[i].sdm.slice(0, 6).map((el, i) => {
                                return <img
                                  class="avatar-card"
                                  style={{ marginLeft: '5px' }}
                                  src={el.avatar}
                                />
                              })
                            }
                          </div>
                        </div>
                      </div>

                    </div>
                  )
                })
                :
              <></>
                  
                
          }
        </div>
        <br />
        <br />
        {/* <div>
          <button onClick={() => Post()} >Predict</button>
        </div>
        <div>
          <button onClick={() => setDetailViewMode(!detailviewmode)} >Switch Mode</button>
        </div>
        <br />
        <div class="card" style={{ boxShadow: 'box-shadow: 9px 10px 5px 1px rgba(0,0,0,0.34)' }}>
          <DetailView mode={detailviewmode} generations={generations} projects={projects} />

        </div> */}
        <div class="d-flex justify-content-between mb-3">
          <div class="font-card-title" style={{ fontSize: '29px' }}>Lainnya</div>
        </div>
        <div class="row">
          {
            projects.map((item, i) => {

              return (
                <div class="col-sm-3 mb-2">

                  <div class="card" style={{ textAlign: 'center', boxShadow: "0px 1px 5px 4px rgba(153,151,151,0.75);" }}>

                    <div style={{ margin: 'auto', width: '20%', paddingBlock: '50px' }}>
                      <div style={{
                        borderRadius: '70px', padding: '20px',
                        backgroundColor: '#f6f6d9'
                      }}>
                        <img src="https://img.icons8.com/plasticine/2x/folder-invoices.png" style={{ width: '30px' }} />
                      </div>
                    </div>
                    <div style={{ marginTop: '-20px', marginBottom: '30px' }}>
                      <div class="other-card-title">{item}</div>
                      <div class="other-card-subtitle" style={{ fontSize: '14px' }}>{attr[i].sdm.length} Member</div>
                    </div>
                  </div>

                </div>
              )
            })
          }
        </div>

        <Modal isOpen={inputModal} toggle={() => setInputModal(!inputModal)} size="md" style={{ maxWidth: '600px', width: '80%' }} >
          <ModalBody>
            <div class="row mb-4">
              <div class="input-title">New Project</div>
            </div>
            <div>
              <div class="mb-2">
                <Form>
                  <FormGroup>
                    <Label>Name</Label>
                    <Input placeholder="Input project name.." onChange={ev => setInput({ ...input, nama: ev.target.value })} />
                  </FormGroup>
                  <div class="row mb-2">
                    <div class="col-6">
                      <InputRate label="Importance" placeholder="Input rate (1 - 10)"
                        onChange={ev => setInput({ ...input, kepentingan: parseInt(ev) })}
                      />
                    </div>
                    <div class="col-6">
                      <InputRate label="Demand" placeholder="Input rate (1 - 10)"
                        onChange={ev => setInput({ ...input, demand: parseInt(ev) })}
                      />
                    </div>
                  </div>
                  <FormGroup>
                    <Label>Deadline</Label>
                    <Input type="date" placeholder="Input project name.." onChange={ev => setInput({ ...input, deadline: ev.target.value })} />
                  </FormGroup>
                  <div class="row mb-2">
                    <div class="col-6">
                      <InputRate label="Frontend" placeholder="Input rate (1 - 10)" onChange={ev => setInput({ ...input, requirements: { ...input.requirements, frontend: parseInt(ev) } })} />
                    </div>
                    <div class="col-6">
                      <InputRate label="Backend" placeholder="Input rate (1 - 10)"
                        onChange={ev => setInput({ ...input, requirements: { ...input.requirements, backend: parseInt(ev) } })}
                      />
                    </div>
                  </div>
                </Form>
              </div>
              <div style={{ border: '1px solid', borderColor: '#ededed', borderRadius: '15px', paddingBlock: '5px', marginTop: '20px' }}>
                {
                  sdm

                    .slice(0, 3)
                    .map(el => {

                      const role_value = input.requirements[el.role]

                      if (input.requirements[el.role] == null) {
                        role_value = 1
                      }

                      return <UserList
                        name={el.name}
                        role={el.role}
                        avatar={el.avatar}
                        passed={input.requirements[el.role] == null ? true : input.requirements[el.role] <= el.skill}

                      />
                    })
                }
                <Collapse isOpen={usercollapse}>
                  {
                    sdm

                      .slice(4, sdm.length)
                      .map(el => {

                        const role_value = input.requirements[el.role]

                        if (input.requirements[el.role] == null) {
                          role_value = 1
                        }

                        return <UserList
                          name={el.name}
                          role={el.role}
                          avatar={el.avatar}
                          passed={input.requirements[el.role] == null ? true : input.requirements[el.role] <= el.skill}

                        />
                      })
                  }
                </Collapse>
                <div class="btn" onClick={() => setCollapse(!usercollapse)}>
                  <div class="row" style={{ paddingInline: '12px' }}>
                    <div class="col-1">
                      <i class="fa fa-ellipsis-h" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div class="col">See More</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ width: '100%' }} class="mt-3">
              <button class="btn btn-primary" style={{ width: '100%' }} onClick={() => addAdditional()} >Submit</button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}

export default App;
