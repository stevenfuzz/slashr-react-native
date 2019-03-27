import React from 'react';
import { Slashr } from 'slashr-react-native';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { fontStyles } from '../styles/styles';
import Menu, { MenuItem } from 'react-native-material-menu';
import ScreenLayout from '../components/layout/ScreenLayout';
import FloatingActionButton from '../components/FloatingActionButton';
import ContainerButton from '../components/ContainerButton';
import IconButton from '../components/IconButton';

const ItemListScreen = Slashr.connect(
  class ItemListScreen extends React.Component {
    constructor(props){
      super(props);
      this.type = this.props.app.dm.item.getTypeById(this.props.navigation.state.params.type);
      this.renderItem = this.renderItem.bind(this);
    }
    renderItem({item}){
     return <ItemListItem item={item} type={this.type} navigation={this.props.navigation} />;
    }
    render() {
      return (
        <ScreenLayout
          gradient
        >
          <FlatList
            keyExtractor={(item)=>(item.uid)}
            data={this.props.app.dm.itemList(this.type.key).items}
            renderItem={this.renderItem}
          />
          <FloatingActionButton 
            icon="plus"
            to="itemCreate"
            params={{
              type: this.type
            }}
          />
        </ScreenLayout>
      );
    }
  }
);
export default ItemListScreen;

const ItemListItem = Slashr.connect(
  class ItemListItem extends React.Component {
    constructor(props){
      super(props);
      this.handleShowMenuPress = this.handleShowMenuPress.bind(this);
      this.handleDeleteItemPress = this.handleDeleteItemPress.bind(this);
      this.handleEditItemPress = this.handleEditItemPress.bind(this);
      this._menu = null;
    }
    handleShowMenuPress(){
      this.showMenu();
    }
    handleDeleteItemPress(){
      this.hideMenu();
      // Confirm that the item should be deleted
      Alert.alert(
        'Delete Entry',
        'Are you sure you want to delete this entry?',
        [
          {text: 'CANCEL', style: 'cancel'},
          {text: 'DELETE', onPress: () => this.deleteItem()},
        ]
      );
    }
    async deleteItem(){
      await this.props.app.dm.item.delete(this.props.item.id);
      this.props.app.dm.itemList.update();
    }
    handleEditItemPress(){
      this.hideMenu();
      this.props.navigation.navigate("itemEdit", {id: this.props.item.id, type: this.props.type});
    }
    hideMenu(){
      this._menu.hide();
    }
    showMenu(){
      this._menu.show();
    }
    render(){
      let item = this.props.item;
      let colors = this.props.app.ui.theme.color;
      let styles = this.style;
      let underlayColor = colors.utils.rgba(colors.onBackground, .08);
      let menuButton = (
        <View style={styles.menuButton}>
          <IconButton 
            icon="kabobMenu"
            size="medium"
            color={colors.utils.rgba(colors.onBackground,.5)}
            onPress={this.handleShowMenuPress}
          />
        </View>
      );
      return (
        <View
          key={item.uid}
        >
          <ContainerButton 
            to="transaction"
            style={styles.item}
          >
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.value}>{item.value}</Text>
              <Menu
                ref={ref => { this._menu = ref; }}
                style={styles.menu}
                button={menuButton}
              >
                <MenuItem underlayColor={underlayColor} textStyle={styles.menuText} onPress={this.handleEditItemPress}>Edit</MenuItem>
                <MenuItem underlayColor={underlayColor} textStyle={styles.menuText} onPress={this.handleDeleteItemPress}>Delete</MenuItem>
              </Menu>
            </View>
          </ContainerButton>
        </View>
      );
    }
    get style(){
      let colors = this.props.app.ui.theme.color;
      return new StyleSheet.create({
        item: {
          flex: 1,
          flexDirection: 'row',
          alignItems: "center",
          padding: 16,
          alignContent: "center",
          margin:16,
          marginBottom:0,
          marginTop:16,
          borderRadius: 4,
          backgroundColor: colors.utils.rgba(colors.onBackground, .08),
        },
        icon: {
          width:40,
          height:40,
          borderRadius: 20,
          backgroundColor: colors.utils.rgba(colors.onBackground, .6),
          flexGrow: 0,
          flexShrink: 1,
          marginTop: 4,
          marginRight: 16
        },
        content: {
          flex: 1,
          flexDirection: 'row',
        },
        title: {
          ...fontStyles.regular,
          color: colors.onBackground,
          lineHeight:20,
          flex:1,
          flexWrap: 'wrap'
        },
        value: {
          ...fontStyles.bold,
          color: colors.onBackground,
          lineHeight:20,
          paddingLeft: 12,
          fontSize: 14,
          marginLeft:"auto"
        },
        menuButton: {
          marginTop: -14,
          marginRight: -16,
          marginBottom: -14
        },
        menu:{
          backgroundColor: colors.surface,
          
        },
        menuText:{
          color: colors.onSurface
        }
      });
    }
  }
);