/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet, TouchableOpacity,
    Text,
    View, TextInput,ScrollView,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import md5 from 'md5';
import { Icon, Button } from 'react-native-elements'
import { connect } from 'react-redux';
import * as Actions from './store/actions'


// const BASE_URL = 'https://gateway.marvel.com:443/v1/public';
const BASE_URL = 'http://gateway.marvel.com/v1/public';
const PVT_KEY = '05327d45daf139e8960883c1f300122f9448928c';
const PUB_KEY = '10fced06b94395ad65d9fd90fc930039';
const color_red = '#D42026';
const N_PER_PAGE = 30;
//for component life cycle
let _mounted = false;

/**
 * Main Screen
 * @param _props
 * @returns {*}
 * @constructor
 */
function Main (_props){
    //scroll view ref
    let scrollViewRef = null;
    ////STATES////
    //for/ search
    const [_nameSearch, _setNameSearch] = React.useState('');

    //heroes list
    // const [_list_heroes, _setlist_heroes] = React.useState([]); //old
    let _list_heroes = _props.store.list_heroes;//from redux

    //control vars
    const [_scrollOffset, _setscrollOffset] = React.useState(0);
    const [_total_regs, _settotal_regs] = React.useState(0);
    const [_selectedPage, _setselectedPage] = React.useState(1);
    const [_isFetching, _setisFetching] = React.useState(true);

    React.useEffect(()=>{

        console.log(":: useEffect ::");
        // console.log(_props.store);

        //save list_heroes from redux store
        _list_heroes = _props.store.list_heroes;

        if (!_mounted){
            //fetch heroes
            fetchMarvelHeros(_nameSearch, 1);
            _mounted = true;
        }
    });

    function scrollToRight ()  {
        if (scrollViewRef) {
            scrollViewRef.scrollTo({x: _scrollOffset + 60, y: _scrollOffset,  animated:true});
            _setscrollOffset(_scrollOffset + 60);
        }
    }
    function  scrollToLeft () {
        if (scrollViewRef && _scrollOffset > 0)  {
            scrollViewRef.scrollTo({x:  _scrollOffset -60, y:  _scrollOffset,  animated:true});
            _setscrollOffset(_scrollOffset - 60);
        }
    }
    function  setScrollViewRef (element) {
        scrollViewRef = element;
    }

    async function fetchMarvelHeros ( heroname , page) {
        console.log("::::  fetchMarvelHeros ::::");
        console.log(heroname);
        console.log(page);

        if ((heroname !== undefined)) {
            if (heroname !== "")
                scrollViewRef.scrollTo({y:0});
        }

        //construindo a call
        let apikey_str = '&apikey='+PUB_KEY;
        let timestamp = new Date().getTime();
        let hash = md5(timestamp + PVT_KEY + PUB_KEY, 'hex');
        let hash_str = '&hash='+hash;


        //page to offset
        let offset = 0;
        if (page > 1)
            offset = N_PER_PAGE * page-1;

        let call= '/characters',
            limit = '&limit=' + N_PER_PAGE,
            offset_str = '&offset=' + offset;

        let nameStartsWith = '&nameStartsWith=' + heroname;
        let CALL_URL = BASE_URL + call +"?ts=" + timestamp +
            apikey_str + hash_str + offset_str + limit;

        if (heroname !== undefined)
            if (heroname !== '')
                CALL_URL += nameStartsWith;

        console.log(CALL_URL);
        fetch(CALL_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(":::: resp fetchMarvelHeros ::::");
                console.log(responseJson);

                // _setlist_heroes(responseJson.data.results);
                _settotal_regs(responseJson.data.total);
                _setselectedPage(page);
                _setisFetching(false);
                //redux dispatch
                _props.dispatch(Actions.load_heroes(responseJson.data.results));


            })
            .catch((error) => {
                console.log(":::::: ERRO NO AUTH ME possivelmente sem conexao fetchAuthMe:::::");
                console.log(error);
            });
    }


    //render for page buttons
    const paginas = [];
    for (let i=0; i<_total_regs / N_PER_PAGE; i++) {
        paginas.push(
            <TouchableOpacity  key={i+1}
                               onPress={() => {
                                   _setselectedPage(i+1);
                                   _setisFetching(true);
                                   fetchMarvelHeros( _nameSearch, i+1);
                               }}
            >
                <View  key={i+1} style={{alignItems: 'center', justifyContent: 'center', borderRadius: 50,
                    borderWidth: 2, width: 30, height: 30, borderColor: color_red, marginRight: 30,
                    backgroundColor: (_selectedPage===i+1?color_red:'white')
                }}>
                    <Text
                        style={{color: (_selectedPage===i+1?'white':color_red), fontWeight: 'bold'}}
                    >
                        { i+1 }
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <>
            <View style={styles2.precontainer}>
                {/*HEADER SEARCH*/}
                <View  style={styles2.containerHeader}>
                    {/*titulo*/}
                    <View style={{flexDirection: 'row',
                    }}>
                        <Text
                            style={{
                                fontFamily: 'Roboto-Light' , fontSize: 16, color: color_red, fontWeight: 'bold',
                                borderColor: color_red, borderBottomWidth: 3
                            }}
                        >BUSCA</Text>
                        <Text style={{fontFamily: 'Roboto-Light' , fontSize: 16, color: color_red, fontWeight: 'bold',
                            borderColor: 'white', borderBottomWidth: 3}}> MARVEL
                            <Text style={{fontWeight: 'normal'}}
                            >TESTE FRONT-END</Text>
                        </Text>
                    </View>

                    {/*input search*/}
                    <View>
                        <Text style={{fontFamily: 'Roboto-Regular' , fontSize: 12, color: color_red}}
                        >Nome do Personagem</Text>
                        <TextInput
                            style={styles2.input}
                            onChangeText={nameSearch => {
                                _setNameSearch(nameSearch);
                                _setisFetching(true);
                                fetchMarvelHeros(nameSearch, 1);
                            }}
                        />
                    </View>
                </View>

                {/*barra vermelha*/}
                <View style={{backgroundColor: color_red, height: 40}} >
                    <Button buttonStyle={{backgroundColor: color_red, height: 40}}
                            loading={_isFetching}
                    />
                </View>

                {/*lista de super herois*/}
                <ScrollView>
                    {
                        _list_heroes.map((hero) => (
                            <View key={hero.id}
                                  style={{flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderColor: color_red }}
                            >
                                <Avatar.Image
                                    size={54}
                                    source={{uri: hero.thumbnail.path + '/portrait_medium.jpg'}}
                                />

                                <View style={{marginLeft: 20, flex: 1, justifyContent: 'center'}}>
                                    <Text style={{fontFamily: 'Roboto-Regular' , fontSize: 20, color: 'grey'}}>
                                        {hero.name}
                                    </Text>
                                    <Text style={{fontFamily: 'Roboto-Regular' , fontSize: 12, color: 'grey'}}>
                                        {hero.description}
                                    </Text>
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>

                {/*paginador*/}
                <View
                    style={{flexDirection: 'row', padding: 10,
                        justifyContent: 'space-between', marginHorizontal: 20
                    }}
                >
                    {/*left*/}
                    <Icon
                        size={35}
                        name='arrow-left-drop-circle'
                        type='material-community'
                        color={color_red}
                        onPress={() => {
                            console.log('hello');
                            scrollToLeft();
                        }}
                    />

                    {/*paginas*/}
                    <View style={{flexDirection: 'row', flex: 1, marginHorizontal: 40, justifyContent: 'center', alignItems: 'center'}}>
                        <ScrollView ref={setScrollViewRef} horizontal={true}>
                            {paginas}
                        </ScrollView>
                    </View>

                    {/*right*/}
                    <Icon
                        size={35}
                        name='arrow-right-drop-circle'
                        type='material-community'
                        color={color_red}
                        onPress={() => {
                            console.log('hello');
                            scrollToRight();
                        }}
                    />
                </View>
            </View>
        </>
    );
}



const styles2 = StyleSheet.create({
    precontainer: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    containerHeader: {
        marginHorizontal: 35,
        marginVertical: 10,
        // width: 300,
        justifyContent: 'center',
        // alignItems: 'center',
        // alignSelf: 'center',
    },
    input: {
        height: 35,
        borderColor: '#9d9d9d', borderWidth: 1,
        borderRadius: 5,
    }

});


export default connect(state => ({ store: state.heroes })) (Main);

