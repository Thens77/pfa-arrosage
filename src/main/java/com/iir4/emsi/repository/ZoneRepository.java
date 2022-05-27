package com.iir4.emsi.repository;


import com.iir4.emsi.domain.Zone;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Zone entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
	@Query("select z from Zone z where z.espaceVert.id = ?1")
	List<Zone> getByEspace(Long id);
	
	@Query("select count(z)  as nbr from Zone z , EspaceVert e WHERE z.espaceVert.id = e.id and e.id=?1 group by e.id")
	Long countZonesByespace(Long e);
	
	
}
