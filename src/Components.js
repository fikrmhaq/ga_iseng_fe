import React, { memo, useState } from "react"
import { Collapse, FormGroup, Input, Label } from "reactstrap"
import theme from './theme.json'

export const DetailView = memo(({ mode, generations, projects }) => {


    return (
        <>
            <Collapse isOpen={mode}>
                <ul>
                    {
                        generations.map(item => {
                            return (
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        {"["}
                                        {item
                                            .map((el, i) => {
                                                return <div style={{ marginRight: '10px' }}>{el}</div>
                                            })}
                                        {"]"}
                                    </div>
                                </div>
                            )
                        })
                    }
                </ul>
            </Collapse>
            <Collapse isOpen={!mode}>
                <ul>
                    {
                        generations.map(item => {
                            return (
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        {item
                                            .map((a, i) => {
                                                if (a == 1) {
                                                    return projects[i]
                                                } else {
                                                    return null
                                                }
                                            })
                                            .filter(el => el != null)
                                            .map((el, i) => {
                                                return <div style={{ marginRight: '10px' }}>{el}</div>
                                            })}
                                    </div>
                                </div>
                            )
                        })
                    }
                </ul>
            </Collapse>
        </>
    )


})


export const UserList = memo(({ name, role, avatar, passed }) => {


    return (
        <div>
            <div style={{ paddingBlock: '2px', paddingInline: '12px', display: 'flex', flexDirection: 'row', opacity: (passed ? 1 : 0.3) }}>
                <img class="input-avatar" src={avatar} />
                <div style={{ marginLeft: '10px' }}>
                    <div>{name}</div>
                    <div style={{ color: '#9f9f9f', fontSize: '14px' }}>{role.split('').map((el, i) => {
                        if (i == 0) {
                            return el.toUpperCase()
                        }
                        return el
                    })}</div>
                </div>
            </div>
            <hr />
        </div>
    )


})


export const InputRate = memo(({ onChange, label, placeholder }) => {
    const [sinput, setInput] = useState(null)

    const onchange = (ev) => {
        if (ev.target.value == null) {
            onChange(1)
        } else {
            onChange(ev.target.value)
        }
    }


    return (
        <div>
            <Label>{label}</Label>
            <input class="form-control" value={sinput} placeholder={placeholder} onChange={onchange} />
        </div>
    )

})

export const PredictedSkeleton = memo((i) => {

    return (
        <div class="col-sm-3 mb-2">

            <div class="card" style={{
                boxShadow: 'none', backgroundColor: theme[i].card, borderRadius: '8px',
                border: 'none'
            }}>
                <div style={{ padding: '30px' }}>
                    <div class="font-card" style={{ color: theme[i].title, fontSize: '21px' }}><span className='placeholder-wave placeholder col-2'></span></div>
                    <div class="font-card" style={{ color: theme[i].subtitle, fontSize: '17px' }}><span className='placeholder-wave placeholder col-2'></span></div>
                    <div style={{ marginTop: '50px' }}>
                    <span className='placeholder-wave placeholder col-7'></span>
                    </div>
                </div>
            </div>

        </div>
    )

})