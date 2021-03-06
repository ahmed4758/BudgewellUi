import React, { useState, useEffect, useCallback, memo} from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   Image,
   ActivityIndicator,
   FlatList,
   StyleSheet
} from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const ItemView = memo(({ item }) => {

   useEffect(() => {
      console.log('Render Item', item.id.toString());
      // unmount
      return () => console.log('Remove Item', item.id.toString());
   }, [])

   return (
      <TouchableOpacity style={styles.listItem} onPress={() => null}>
         <Image
            source={{ uri : item.thumbnailUrl}}
            style={styles.thumbnail}
         />
         <Text style={styles.itemTxt} numberOfLines={2} >{[ item.id, item.title ].join('. ')}</Text>
      </TouchableOpacity>
   )
})

const Footer = memo(({ loading, fetchData }) => {
   useEffect(() => {
      console.log('render Footer', loading ? 'Start' : 'End');
   }, [])
   const [error, setError] = useState(null);

   return (
      <View style={styles.footer}>
         <TouchableOpacity 
            onPress={fetchData}
            style={styles.loadMoreBtn}
         >
            <Text style={styles.btnText}>{ error ? 'Try Again' : 'Load More' }</Text>
            {
               loading ? <ActivityIndicator color="white" style={{ marginLeft: 8}}/> : null
            }
         </TouchableOpacity>
      </View>
   )
})

const useCustomeHooks = () => {
   const [dataSource, setDataSource] = useState([]);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const fetchData = useCallback(() => setLoading(true), []);

   const getData = () => {
      if(error) setError(null);
      console.log('render page', page.toString());
      fetch(`https://jsonplaceholder.typicode.com/albums/1/photos`)
      .then(resp => resp.json())
      .then(resp => {
         setLoading(false);
         setPage(page + 1)
         setDataSource([...dataSource, ...resp])
      })
      .catch(err => {
         console.log(err);
         setError('Failed Fetch Data, Please Try Again Later');
         setLoading(false)
      })
   }

   useEffect(() => {
      if(!loading) return;
      getData()
   }, [loading])

   return[loading, dataSource, fetchData, error]

}
const Home = () => {
   const [loading, dataSource, fetchData, error] = useCustomeHooks();

   const renderItem = useCallback(({ item }) => <ItemView item={item}/>, [])
   const keyExtractor = useCallback(item => item.id.toString(), [])
   const renderFooter  = useCallback(() => <Footer loading={loading} fetchData={fetchData} error={error} />, [loading, error])
  
   useEffect(() => {
      console.log('Render APP');
   }, [])

   return (
       <ScrollView>
    <View style={{flexDirection: 'row', backgroundColor: "#9400FA", marginBottom: 20,marginTop:50}}>
    <View style={[styles.centerElement, {width: 60, height: 60, marginLeft:5}]}>
        <Ionicons name="journal-sharp" size={40} color="white" />
    </View>
    <View style={[styles.centerElement, {height: 60,marginLeft:5}]}>
        <Text style={{fontSize: 22, color: 'white'}}>Contact List</Text>
    </View>
<View style={[styles.centerElement, {width: 60, height: 60, marginLeft:170}]}>
        <Ionicons name="notifications" size={30} color="white" />
    </View>
</View>
<View>

<FlatList
       data={dataSource}
       renderItem={renderItem}
       keyExtractor={keyExtractor}
       ListFooterComponent={renderFooter}
     />
</View>
	
</ScrollView> 
   );
};

const styles = StyleSheet.create({
   listItem:{
      flexDirection:'row',
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
   },
   itemTxt: {
      flex: 1,
      paddingVertical: 10,
      paddingLeft: 10,
      color: 'black',
   },
   thumbnail:{
      width: 50,
      height: 50,
      borderRadius: 8
   },
   footer: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
   },
   loadMoreBtn: {
      padding: 10,
      backgroundColor: '#9400FA',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   btnText: {
      color: 'white',
      fontSize: 15,
      textAlign: 'center',
   },
   centerElement: {
      justifyContent: 'center',
      alignItems: 'center'
    }

})
export default Home;