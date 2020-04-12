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


// const BASE_URL = 'https://gateway.marvel.com:443/v1/public';
const BASE_URL = 'http://gateway.marvel.com/v1/public';
const PVT_KEY = '05327d45daf139e8960883c1f300122f9448928c';
const PUB_KEY = '10fced06b94395ad65d9fd90fc930039';
const color_red = '#D42026';

type Props = {};
export default class MainPage extends Component<Props> {

    state = {
        //p/ search
        nameSearch: '',

        //vetor de heroes
        list_heroes: [],

        //vars de controle
        scrollOffset: 0,
        total_regs: 0,
        selectedPage: 1,
        modal_heroDetails_visible: false,
        isFetching: true,
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        //fetch heroes
        this.fetchMarvelHeros("", 1);
    }


    render() {

        //render para paginas
        const paginas = [];
        for (let i=0; i<this.state.total_regs / 4; i++) {
            paginas.push(
                <TouchableOpacity  key={i+1}
                    onPress={() => {
                        this.setState({
                            selectedPage: i+1,
                            isFetching: true
                        });
                        this.fetchMarvelHeros( this.state.nameSearch, i+1);
                    }}
                >
                    <View  key={i+1} style={{alignItems: 'center', justifyContent: 'center', borderRadius: 50,
                        borderWidth: 2, width: 30, height: 30, borderColor: color_red, marginRight: 30,
                        backgroundColor: (this.state.selectedPage===i+1?color_red:'white')
                    }}>
                        <Text
                            style={{color: (this.state.selectedPage===i+1?'white':color_red), fontWeight: 'bold'}}
                        >
                            { i+1 }
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
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
                            // value={this.state.text}
                            onChangeText={nameSearch => {
                                this.setState({
                                    nameSearch,
                                    isFetching: true
                                });
                                this.fetchMarvelHeros(nameSearch, 1);
                            }}
                        />
                    </View>
                </View>

                {/*barra vermelha*/}
                <View style={{backgroundColor: color_red, height: 40}} >
                    <Button buttonStyle={{backgroundColor: color_red, height: 40}}
                            loading={this.state.isFetching}
                    />
                </View>

                {/*lista de super herois*/}
                <ScrollView>
                    {
                        this.state.list_heroes.map((hero) => (
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
                            this.scrollToLeft();
                        }}
                    />

                    {/*paginas*/}
                    <View style={{flexDirection: 'row', flex: 1, marginHorizontal: 40, justifyContent: 'center', alignItems: 'center'}}>
                        <ScrollView ref={this.setScrollViewRef} horizontal={true}>
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
                            this.scrollToRight();
                        }}
                    />
                </View>
            </View>
        );
    }

    scrollToRight = () => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo({x: this.state.scrollOffset + 60, y: this.state.scrollOffset,  animated:true});
            this.setState({scrollOffset: this.state.scrollOffset + 60});
        }
    };
    scrollToLeft = () => {
        if (this.scrollViewRef && this.state.scrollOffset > 0)  {
            this.scrollViewRef.scrollTo({x:  this.state.scrollOffset -60, y:  this.state.scrollOffset,  animated:true});
            this.setState({scrollOffset: this.state.scrollOffset - 60});
        }

    };
    setScrollViewRef = (element) => {
        this.scrollViewRef = element;
    };

    fetchMarvelHeros( heroname , page) {
        console.log("::::  fetchMarvelHeros ::::");

        if ((heroname !== undefined)) {
            if (heroname !== "")
                    this.scrollViewRef.scrollTo({y:0});
        }

        //construindo a call
        let apikey_str = '&apikey='+PUB_KEY;
        let timestamp = new Date().getTime();
        let hash = md5(timestamp + PVT_KEY + PUB_KEY, 'hex');
        let hash_str = '&hash='+hash;


        //page to offset
        let offset = 0;
        if (page > 1)
            offset = 4 * page-1;

        let call= '/characters',
            limit = '&limit=' + 4,
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
            // body: JSON.stringify({
            //     email: this.state.emailEsquecido,
            // }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(":::: resp fetchMarvelHeros ::::");
                console.log(responseJson);

                this.setState({
                    list_heroes: responseJson.data.results,
                    total_regs: responseJson.data.total,
                    selectedPage: page,
                    isFetching: false,
                });
            })
            .catch((error) => {
                console.log(":::::: ERRO NO AUTH ME possivelmente sem conexao fetchAuthMe:::::");
                console.log(error);
            });
    }

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
